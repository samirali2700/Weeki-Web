
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.48.0 */

    function create_fragment$N(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$N.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.48.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$8, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$M.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.48.0 */
    const file$K = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$L(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$K, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$L.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    function link(node) {
      function onClick(event) {
        const anchor = event.currentTarget;

        if (
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event)
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    // export const loggedIn = writable(true);

    //{name: 'ali', email: 'samirali@live.dk', admin: true}
    const user = writable({});


    const loggedIn = derived(user, ($user) => {
        if(Object.keys($user).length > 0){
            return true;
        }
        return false;
      
    });

    //extra and different layout for admin
    //+previleges
    const isAdmin = derived(([loggedIn, user]), ($value, set) => {
        if($value[0]){
            if($value[1].admin){
                 set(true);
            }
            else set(false);
        }
    });

    /* src\ProtectedRoute.svelte generated by Svelte v3.48.0 */

    // (11:0) {#if isAuthenticated}
    function create_if_block$d(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: /*path*/ ctx[0],
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*path*/ 1) route_changes.path = /*path*/ ctx[0];

    			if (dirty & /*$$scope, component*/ 18) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(11:0) {#if isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (12:2) <Route {path}>
    function create_default_slot$h(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(12:2) <Route {path}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isAuthenticated*/ ctx[2] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isAuthenticated*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isAuthenticated*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let isAuthenticated;
    	let $loggedIn;
    	validate_store(loggedIn, 'loggedIn');
    	component_subscribe($$self, loggedIn, $$value => $$invalidate(3, $loggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProtectedRoute', slots, []);
    	let { path } = $$props;
    	let { component } = $$props;
    	const writable_props = ['path', 'component'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProtectedRoute> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		navigate,
    		loggedIn,
    		path,
    		component,
    		isAuthenticated,
    		$loggedIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    		if ('isAuthenticated' in $$props) $$invalidate(2, isAuthenticated = $$props.isAuthenticated);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$loggedIn*/ 8) {
    			$$invalidate(2, isAuthenticated = $loggedIn);
    		}
    	};

    	return [path, component, isAuthenticated, $loggedIn];
    }

    class ProtectedRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, { path: 0, component: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProtectedRoute",
    			options,
    			id: create_fragment$K.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*path*/ ctx[0] === undefined && !('path' in props)) {
    			console.warn("<ProtectedRoute> was created without expected prop 'path'");
    		}

    		if (/*component*/ ctx[1] === undefined && !('component' in props)) {
    			console.warn("<ProtectedRoute> was created without expected prop 'component'");
    		}
    	}

    	get path() {
    		throw new Error("<ProtectedRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<ProtectedRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<ProtectedRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<ProtectedRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /**
     * This will be a general store for the app
     * app specific configuration
     * like, theme current page
     */

    //page either lastvisited from session if exist, or default home page '/'
    const page = writable(sessionStorage.getItem('lastVisited') || '/');


    const isLoading = writable(false);


    /**
     * Save in db? or hardcode the themes?
     * for now the solution will be hardcoded
     * and in the future the possibility to switch over to db is there
     */
    const themes = writable([
        {
            "name": "default",
            "display-name": "Original",
            "primary": '#000000',
            "secondary": '#0088ff',
            "text": "#fff"
        },

        { 
            "name": 'honesty',
            "display-name": "Ærlighed",
            "primary": "#89ABE3FF",
            "secondary": "#FCF6F5FF",
            "text": "#000"
        },
        { 
            "name": 'summer',
            "display-name": "Sommer",
            "primary": "#00B1D2FF",
            "secondary": "#FDDB27FF",
            "text": "#000"
        },
        { 
            "name": 'easy_going',
            "display-name": "Stille og Rolig",
            "primary": "#101820FF",
            "secondary": "#FEE715FF",
            "text": "#fff"
        },
        {
            "name": "seabed",
            "display-name": "Havbund",
            "primary": '#FC766AFF',
            "secondary": '#5B84B1FF',
            "text": "#fff"
        },
        {
            "name": "strength_and_hope",
            "display-name": "Styrke og Håb",
            "primary": '#949398FF',
            "secondary": '#F4DF4EFF',
            "text": "#000"
        },
        {
            "name": "vibrant",
            "display-name": "Levende",
            "primary": '#00A4CCFF',
            "secondary": '#F95700FF',
            "text": "#000"
        },
        {
            "name": "tropical",
            "display-name": "Tropisk",
            "primary": '#42EADDFF',
            "secondary": '#CDB599FF',
            "text": "#fff"
        },
        { 
            "name": 'cold_mint',
            "display-name": "Frisk Mynte",
            "primary": "#00203FFF",
            "secondary": "#ADEFD1FF",
            "text": "#fff"
        },
        { 
            "name": 'greenery',
            "display-name": "Naturen",
            "primary": "#03811c",//
            "secondary": "#3db217",
            "text": "#fff"
        },
        { 
            "name": 'creativity',
            "display-name": "Kreativit",
            "primary": "#00539CFF",
            "secondary": "#EEA47FFF",
            "text": "#fff"
        },
        { 
            "name": 'cherry_tomato',
            "display-name": "Cherry Tomat",
            "primary": "#2D2926FF",
            "secondary": "#E94B3CFF",
            "text": "#fff"
        },
        {
            "name": "magic",
            "display-name": "Magi",
            "primary": '#5F4B8BFF',
            "secondary": '#E69A8DFF',
            "text": "#fff"
        },
        {
            "name": "custom",
            "display-name": "custom",
            "primary": '',
            "secondary": '',
            "text": "#fff"
        }
         
    ]);


    /**
     * Should the theme the user chose be stored in localStorage or in db?
     * the easiest and fastest solution is localStorage
     * but to have to choose a theme again if the localStorage is deleted 
     * or loggedIn from somewhere different from usual
     * is not something i would like, personaly, but for now the theme will be stored in local
     */

    const theme = writable(localStorage.getItem('theme') || 'default');

    //the theme is stored in local each time the theme is changed 
    localStorage.setItem('theme', get_store_value(theme));



    //derive primary and seconday colors from current theme and themes list
    const primary_color = derived([theme, themes], ($value, set) => {
        set($value[1].find((c) => c.name === $value[0]).primary || '#000');
    });

    const secondary_color = derived([theme, themes], ($value, set) => {
        set($value[1].find((c) => c.name === $value[0]).secondary || '#0088ff');
    });

    const text_color = derived([theme, themes], ($value, set) => {
        set($value[1].find((c) => c.name === $value[0]).text);
    });

    /* src\Public\Login.svelte generated by Svelte v3.48.0 */
    const file$J = "src\\Public\\Login.svelte";

    function create_fragment$J(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div1;
    	let form;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let input2;
    	let t10;
    	let div2;
    	let p1;
    	let t11;
    	let span;
    	let a;
    	let div4_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Velkommen Tilbage";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Login og planlæg din vagtplan nemt og hutigt!";
    			t3 = space();
    			div1 = element("div");
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Brugernavn*";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Adgangskode*";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div2 = element("div");
    			p1 = element("p");
    			t11 = text("Har du ikke en bruger? ");
    			span = element("span");
    			a = element("a");
    			a.textContent = "Registrer din Virksomhed her";
    			attr_dev(h1, "class", "text svelte-1x3mlxb");
    			add_location(h1, file$J, 34, 6, 857);
    			attr_dev(p0, "class", "text svelte-1x3mlxb");
    			add_location(p0, file$J, 35, 6, 904);
    			attr_dev(div0, "class", "intro svelte-1x3mlxb");
    			add_location(div0, file$J, 33, 4, 830);
    			attr_dev(label0, "for", "email");
    			attr_dev(label0, "class", "svelte-1x3mlxb");
    			add_location(label0, file$J, 39, 8, 1049);
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "name", "email");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-1x3mlxb");
    			add_location(input0, file$J, 40, 8, 1098);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-1x3mlxb");
    			add_location(label1, file$J, 42, 8, 1171);
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "type", "password");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-1x3mlxb");
    			add_location(input1, file$J, 43, 8, 1224);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Login";
    			attr_dev(input2, "class", "w3-button w3-round-small w3-hover-black w3-left-align svelte-1x3mlxb");
    			set_style(input2, "height", `45px`, false);
    			set_style(input2, "margin-top", `35px`, false);
    			add_location(input2, file$J, 45, 8, 1306);
    			attr_dev(form, "class", "svelte-1x3mlxb");
    			add_location(form, file$J, 38, 6, 1000);
    			add_location(div1, file$J, 37, 4, 987);
    			attr_dev(a, "href", "/signup");
    			attr_dev(a, "class", "svelte-1x3mlxb");
    			add_location(a, file$J, 57, 11, 1632);
    			add_location(span, file$J, 56, 31, 1614);
    			attr_dev(p1, "class", "w3-section");
    			add_location(p1, file$J, 55, 6, 1559);
    			add_location(div2, file$J, 54, 4, 1546);
    			attr_dev(div3, "class", "content svelte-1x3mlxb");
    			add_location(div3, file$J, 32, 2, 803);
    			attr_dev(div4, "class", "container w3-threequarter svelte-1x3mlxb");
    			add_location(div4, file$J, 31, 0, 751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, form);
    			append_dev(form, label0);
    			append_dev(form, t5);
    			append_dev(form, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(form, t6);
    			append_dev(form, label1);
    			append_dev(form, t8);
    			append_dev(form, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t9);
    			append_dev(form, input2);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(p1, t11);
    			append_dev(p1, span);
    			append_dev(span, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(form, "submit", prevent_default(/*login*/ ctx[2]), false, true, false),
    					action_destroyer(link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (!div4_intro) {
    				add_render_callback(() => {
    					div4_intro = create_in_transition(div4, slide, {});
    					div4_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let $isLoading;
    	let $user;
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(5, $isLoading = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let email;
    	let password;

    	async function login() {
    		set_store_value(isLoading, $isLoading = true, $isLoading);

    		const options = {
    			method: "POST",
    			headers: { "Content-type": "application/json" },
    			body: JSON.stringify({ email, password })
    		};

    		const response = await fetch("/signin", options);
    		const data = await response.json();

    		if (response.status !== 403) {
    			set_store_value(user, $user = data, $user);
    		} else {
    			toastr.error(data.error, "Fejl", { positionClass: "toast-top-left" });
    		}

    		set_store_value(isLoading, $isLoading = false, $isLoading);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		link,
    		slide,
    		isLoading,
    		user,
    		email,
    		password,
    		login,
    		$isLoading,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [email, password, login, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* node_modules\svelte-icons\components\IconBase.svelte generated by Svelte v3.48.0 */

    const file$I = "node_modules\\svelte-icons\\components\\IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$c(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$I, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$c(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$I, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;
    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$I.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*viewBox*/ ctx[1] === undefined && !('viewBox' in props)) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\ti\TiArrowBackOutline.svelte generated by Svelte v3.48.0 */
    const file$H = "node_modules\\svelte-icons\\ti\\TiArrowBackOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$g(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484v1.437c0 .534-.208 1.036-.586 1.414-.756.756-2.077.751-2.823.005l-6.293-6.207c-.191-.189-.298-.444-.298-.713s.107-.524.298-.712l6.288-6.203c.754-.755 2.073-.756 2.829.001.377.378.585.88.585 1.414v1.704c4.619.933 8 4.997 8 9.796v1c0 .442-.29.832-.714.958-.095.027-.19.042-.286.042-.331 0-.646-.165-.836-.452zm-7.141-5.536c2.207.056 4.638.394 6.758 2.121-.768-3.216-3.477-5.702-6.893-6.08-.504-.056-.888-.052-.888-.052v-3.497l-5.576 5.496 5.576 5.5v-3.499l1.023.011z");
    			add_location(path, file$H, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$g] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiArrowBackOutline', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class TiArrowBackOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiArrowBackOutline",
    			options,
    			id: create_fragment$H.name
    		});
    	}
    }

    /* src\Public\Signup\Create.svelte generated by Svelte v3.48.0 */
    const file$G = "src\\Public\\Signup\\Create.svelte";

    // (127:23) 
    function create_if_block_1$7(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let form;
    	let label0;
    	let t4;
    	let input0;
    	let t5;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let label2;
    	let t8;
    	let input2;
    	let t9;
    	let input3;
    	let div1_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Registrer din Virksomhed";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Du er der næsten, sidste trin så kan du komme i gang med det samme!";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			t4 = text("Virksomhed*\r\n          ");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			t6 = text("CVR*\r\n          ");
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			t8 = text("Telefon nummer*\r\n          ");
    			input2 = element("input");
    			t9 = space();
    			input3 = element("input");
    			attr_dev(h2, "class", "svelte-pqnp2p");
    			add_location(h2, file$G, 129, 8, 3199);
    			attr_dev(p, "class", "svelte-pqnp2p");
    			add_location(p, file$G, 130, 8, 3242);
    			attr_dev(div0, "class", "w3-section");
    			add_location(div0, file$G, 128, 6, 3165);
    			input0.required = true;
    			attr_dev(input0, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input0, file$G, 137, 10, 3452);
    			attr_dev(label0, "class", "svelte-pqnp2p");
    			add_location(label0, file$G, 135, 8, 3410);
    			attr_dev(input1, "type", "number");
    			input1.required = true;
    			attr_dev(input1, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input1, file$G, 141, 10, 3577);
    			attr_dev(label1, "class", "svelte-pqnp2p");
    			add_location(label1, file$G, 139, 8, 3542);
    			attr_dev(input2, "type", "tel");
    			input2.required = true;
    			attr_dev(input2, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input2, file$G, 150, 10, 3789);
    			attr_dev(label2, "class", "svelte-pqnp2p");
    			add_location(label2, file$G, 148, 8, 3743);
    			attr_dev(input3, "type", "submit");
    			input3.value = "Opret";
    			attr_dev(input3, "class", "w3-button w3-left-align svelte-pqnp2p");
    			add_location(input3, file$G, 157, 8, 3954);
    			add_location(form, file$G, 134, 6, 3360);
    			attr_dev(div1, "class", "w3-container");
    			add_location(div1, file$G, 127, 4, 3122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div1, t3);
    			append_dev(div1, form);
    			append_dev(form, label0);
    			append_dev(label0, t4);
    			append_dev(label0, input0);
    			set_input_value(input0, /*company*/ ctx[4].name);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(label1, t6);
    			append_dev(label1, input1);
    			set_input_value(input1, /*company*/ ctx[4].cvr);
    			append_dev(form, t7);
    			append_dev(form, label2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*company*/ ctx[4].phone);
    			append_dev(form, t9);
    			append_dev(form, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[16]),
    					listen_dev(form, "submit", prevent_default(/*signup*/ ctx[7]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*company*/ 16 && input0.value !== /*company*/ ctx[4].name) {
    				set_input_value(input0, /*company*/ ctx[4].name);
    			}

    			if (dirty & /*company*/ 16 && to_number(input1.value) !== /*company*/ ctx[4].cvr) {
    				set_input_value(input1, /*company*/ ctx[4].cvr);
    			}

    			if (dirty & /*company*/ 16) {
    				set_input_value(input2, /*company*/ ctx[4].phone);
    			}
    		},
    		i: function intro(local) {
    			if (!div1_intro) {
    				add_render_callback(() => {
    					div1_intro = create_in_transition(div1, slide, {});
    					div1_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(127:23) ",
    		ctx
    	});

    	return block;
    }

    // (59:2) {#if step === 0}
    function create_if_block$b(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let form;
    	let label0;
    	let t5;
    	let span;
    	let input0;
    	let t6;
    	let input1;
    	let t7;
    	let label1;
    	let t8;
    	let input2;
    	let t9;
    	let label2;
    	let t10;
    	let input3;
    	let t11;
    	let label3;
    	let t12;
    	let input4;
    	let t13;
    	let label4;
    	let t14;
    	let input5;
    	let t15;
    	let input6;
    	let div1_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Opret en ny bruger";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Først har vi brug for dine personlige informationer";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Navn";
    			t5 = space();
    			span = element("span");
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			label1 = element("label");
    			t8 = text("Email*\r\n          ");
    			input2 = element("input");
    			t9 = space();
    			label2 = element("label");
    			t10 = text("Mobil nummer\r\n          ");
    			input3 = element("input");
    			t11 = space();
    			label3 = element("label");
    			t12 = text("Adgangskode*\r\n          ");
    			input4 = element("input");
    			t13 = space();
    			label4 = element("label");
    			t14 = text("Gentag Adgangskode*\r\n          ");
    			input5 = element("input");
    			t15 = space();
    			input6 = element("input");
    			attr_dev(h2, "class", "svelte-pqnp2p");
    			add_location(h2, file$G, 61, 8, 1370);
    			attr_dev(p, "class", "svelte-pqnp2p");
    			add_location(p, file$G, 62, 8, 1407);
    			attr_dev(div0, "class", "title svelte-pqnp2p");
    			add_location(div0, file$G, 60, 6, 1341);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-pqnp2p");
    			add_location(label0, file$G, 65, 8, 1537);
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input0, "placeholder", "Fornavn");
    			add_location(input0, file$G, 67, 10, 1610);
    			attr_dev(input1, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input1, "placeholder", "Efternavn");
    			add_location(input1, file$G, 73, 10, 1772);
    			attr_dev(span, "class", "name svelte-pqnp2p");
    			add_location(span, file$G, 66, 8, 1579);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input2, "placeholder", "Efternavn");
    			input2.required = true;
    			add_location(input2, file$G, 81, 10, 1964);
    			attr_dev(label1, "class", "svelte-pqnp2p");
    			add_location(label1, file$G, 79, 8, 1927);
    			attr_dev(input3, "class", "w3-card-2 svelte-pqnp2p");
    			input3.disabled = true;
    			attr_dev(input3, "placeholder", "deaktiveret");
    			add_location(input3, file$G, 91, 10, 2208);
    			attr_dev(label2, "class", "svelte-pqnp2p");
    			add_location(label2, file$G, 89, 8, 2165);
    			attr_dev(input4, "type", "password");
    			input4.required = true;
    			attr_dev(input4, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input4, file$G, 100, 10, 2428);
    			attr_dev(label3, "class", "svelte-pqnp2p");
    			add_location(label3, file$G, 98, 8, 2385);
    			attr_dev(input5, "type", "password");
    			input5.required = true;
    			attr_dev(input5, "class", "w3-card-2 svelte-pqnp2p");
    			toggle_class(input5, "error", /*errors*/ ctx[1].find(func));
    			add_location(input5, file$G, 110, 10, 2683);
    			attr_dev(label4, "class", "svelte-pqnp2p");
    			add_location(label4, file$G, 108, 8, 2633);
    			attr_dev(input6, "type", "submit");
    			input6.value = "Næste Trin";
    			attr_dev(input6, "class", "w3-button w3-left-align svelte-pqnp2p");
    			add_location(input6, file$G, 119, 8, 2948);
    			add_location(form, file$G, 64, 6, 1487);
    			attr_dev(div1, "class", "w3-container");
    			add_location(div1, file$G, 59, 4, 1298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div1, t3);
    			append_dev(div1, form);
    			append_dev(form, label0);
    			append_dev(form, t5);
    			append_dev(form, span);
    			append_dev(span, input0);
    			set_input_value(input0, /*user*/ ctx[3].firstname);
    			append_dev(span, t6);
    			append_dev(span, input1);
    			set_input_value(input1, /*user*/ ctx[3].lastname);
    			append_dev(form, t7);
    			append_dev(form, label1);
    			append_dev(label1, t8);
    			append_dev(label1, input2);
    			set_input_value(input2, /*user*/ ctx[3].email);
    			append_dev(form, t9);
    			append_dev(form, label2);
    			append_dev(label2, t10);
    			append_dev(label2, input3);
    			set_input_value(input3, /*user*/ ctx[3].phone);
    			append_dev(form, t11);
    			append_dev(form, label3);
    			append_dev(label3, t12);
    			append_dev(label3, input4);
    			set_input_value(input4, /*user*/ ctx[3].password);
    			append_dev(form, t13);
    			append_dev(form, label4);
    			append_dev(label4, t14);
    			append_dev(label4, input5);
    			set_input_value(input5, /*rePass*/ ctx[2]);
    			append_dev(form, t15);
    			append_dev(form, input6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
    					listen_dev(input4, "input", /*checkMatch*/ ctx[6], false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[13]),
    					listen_dev(input5, "input", /*checkMatch*/ ctx[6], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*goNext*/ ctx[5]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*user*/ 8 && input0.value !== /*user*/ ctx[3].firstname) {
    				set_input_value(input0, /*user*/ ctx[3].firstname);
    			}

    			if (dirty & /*user*/ 8 && input1.value !== /*user*/ ctx[3].lastname) {
    				set_input_value(input1, /*user*/ ctx[3].lastname);
    			}

    			if (dirty & /*user*/ 8 && input2.value !== /*user*/ ctx[3].email) {
    				set_input_value(input2, /*user*/ ctx[3].email);
    			}

    			if (dirty & /*user*/ 8 && input3.value !== /*user*/ ctx[3].phone) {
    				set_input_value(input3, /*user*/ ctx[3].phone);
    			}

    			if (dirty & /*user*/ 8 && input4.value !== /*user*/ ctx[3].password) {
    				set_input_value(input4, /*user*/ ctx[3].password);
    			}

    			if (dirty & /*rePass*/ 4 && input5.value !== /*rePass*/ ctx[2]) {
    				set_input_value(input5, /*rePass*/ ctx[2]);
    			}

    			if (dirty & /*errors*/ 2) {
    				toggle_class(input5, "error", /*errors*/ ctx[1].find(func));
    			}
    		},
    		i: function intro(local) {
    			if (!div1_intro) {
    				add_render_callback(() => {
    					div1_intro = create_in_transition(div1, slide, {});
    					div1_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(59:2) {#if step === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*step*/ ctx[0] === 0) return create_if_block$b;
    		if (/*step*/ ctx[0] === 1) return create_if_block_1$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "content");
    			add_location(div, file$G, 57, 0, 1251);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = t => t.name === "rePass";

    function instance$G($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create', slots, []);
    	const dispatch = createEventDispatcher();

    	//array with the name of the inputs that are unacceptable in anyway
    	let errors = [];

    	let rePass = "123456789";
    	let { step } = $$props;

    	let user = {
    		firstname: "ali",
    		lastname: "Chouikhi",
    		email: "samirali@live.dk",
    		phone: "25323150",
    		password: "123456789"
    	};

    	let company = {
    		name: "Weeki",
    		cvr: "4568743151",
    		phone: "421545651"
    	};

    	function goNext() {
    		//only runs if true
    		if (checkMatch()) {
    			/**
     * The user data is stored inside user object
     * now next step is the company data
     *
     */
    			$$invalidate(0, step = 1);
    		}
    	}

    	function checkMatch() {
    		if (rePass.length > 0) {
    			if (user.password !== rePass) {
    				if (!errors.find(e => e.name === "rePass")) {
    					$$invalidate(1, errors = [...errors, { name: "rePass" }]);
    					return false;
    				}
    			} else {
    				$$invalidate(1, errors = errors.filter(e => e.name !== "rePass"));
    				return true;
    			}
    		}

    		return false;
    	}

    	function signup() {
    		dispatch("signup", [user, company]);
    	}

    	const writable_props = ['step'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user.firstname = this.value;
    		$$invalidate(3, user);
    	}

    	function input1_input_handler() {
    		user.lastname = this.value;
    		$$invalidate(3, user);
    	}

    	function input2_input_handler() {
    		user.email = this.value;
    		$$invalidate(3, user);
    	}

    	function input3_input_handler() {
    		user.phone = this.value;
    		$$invalidate(3, user);
    	}

    	function input4_input_handler() {
    		user.password = this.value;
    		$$invalidate(3, user);
    	}

    	function input5_input_handler() {
    		rePass = this.value;
    		$$invalidate(2, rePass);
    	}

    	function input0_input_handler_1() {
    		company.name = this.value;
    		$$invalidate(4, company);
    	}

    	function input1_input_handler_1() {
    		company.cvr = to_number(this.value);
    		$$invalidate(4, company);
    	}

    	function input2_input_handler_1() {
    		company.phone = this.value;
    		$$invalidate(4, company);
    	}

    	$$self.$$set = $$props => {
    		if ('step' in $$props) $$invalidate(0, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		createEventDispatcher,
    		dispatch,
    		errors,
    		rePass,
    		step,
    		user,
    		company,
    		goNext,
    		checkMatch,
    		signup
    	});

    	$$self.$inject_state = $$props => {
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('rePass' in $$props) $$invalidate(2, rePass = $$props.rePass);
    		if ('step' in $$props) $$invalidate(0, step = $$props.step);
    		if ('user' in $$props) $$invalidate(3, user = $$props.user);
    		if ('company' in $$props) $$invalidate(4, company = $$props.company);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		step,
    		errors,
    		rePass,
    		user,
    		company,
    		goNext,
    		checkMatch,
    		signup,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1
    	];
    }

    class Create extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { step: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create",
    			options,
    			id: create_fragment$G.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*step*/ ctx[0] === undefined && !('step' in props)) {
    			console.warn("<Create> was created without expected prop 'step'");
    		}
    	}

    	get step() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\Join.svelte generated by Svelte v3.48.0 */

    const file$F = "src\\Public\\Signup\\Join.svelte";

    function create_fragment$F(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$F, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Join', slots, []);
    	let { step } = $$props;
    	const writable_props = ['step'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Join> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('step' in $$props) $$invalidate(0, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({ step });

    	$$self.$inject_state = $$props => {
    		if ('step' in $$props) $$invalidate(0, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [step];
    }

    class Join extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, { step: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Join",
    			options,
    			id: create_fragment$F.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*step*/ ctx[0] === undefined && !('step' in props)) {
    			console.warn("<Join> was created without expected prop 'step'");
    		}
    	}

    	get step() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$E = "src\\Public\\Signup.svelte";

    // (94:30) 
    function create_if_block_2$2(ctx) {
    	let join;
    	let current;
    	join = new Join({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(join.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(join, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(join.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(join.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(join, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(94:30) ",
    		ctx
    	});

    	return block;
    }

    // (92:32) 
    function create_if_block_1$6(ctx) {
    	let create;
    	let updating_step;
    	let current;

    	function create_step_binding(value) {
    		/*create_step_binding*/ ctx[6](value);
    	}

    	let create_props = {};

    	if (/*step*/ ctx[1] !== void 0) {
    		create_props.step = /*step*/ ctx[1];
    	}

    	create = new Create({ props: create_props, $$inline: true });
    	binding_callbacks.push(() => bind(create, 'step', create_step_binding));
    	create.$on("signup", /*signup*/ ctx[3]);

    	const block = {
    		c: function create$1() {
    			create_component(create.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(create, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const create_changes = {};

    			if (!updating_step && dirty & /*step*/ 2) {
    				updating_step = true;
    				create_changes.step = /*step*/ ctx[1];
    				add_flush_callback(() => updating_step = false);
    			}

    			create.$set(create_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(create.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(create.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(create, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(92:32) ",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if method === "init"}
    function create_if_block$a(ctx) {
    	let div5;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let div3;
    	let div1;
    	let b0;
    	let t5;
    	let small0;
    	let t7;
    	let div2;
    	let b1;
    	let t9;
    	let small1;
    	let t11;
    	let div4;
    	let div5_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Hej!";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Hvad er du her for at lave i dag?";
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			b0 = element("b");
    			b0.textContent = "Oprette en ny bruger";
    			t5 = space();
    			small0 = element("small");
    			small0.textContent = "Jeg vil gerne se om Weeki er noget for min virksomhed";
    			t7 = space();
    			div2 = element("div");
    			b1 = element("b");
    			b1.textContent = "Slutte mig til mine kollegaer";
    			t9 = space();
    			small1 = element("small");
    			small1.textContent = "Jeg vil gerne finde mit hold og se min vagtplan";
    			t11 = space();
    			div4 = element("div");
    			attr_dev(h2, "class", "svelte-dy5ndi");
    			add_location(h2, file$E, 66, 8, 1696);
    			attr_dev(p, "class", "svelte-dy5ndi");
    			add_location(p, file$E, 67, 8, 1719);
    			attr_dev(div0, "class", "title svelte-dy5ndi");
    			add_location(div0, file$E, 65, 6, 1667);
    			attr_dev(b0, "class", "svelte-dy5ndi");
    			add_location(b0, file$E, 76, 10, 1955);
    			attr_dev(small0, "class", "svelte-dy5ndi");
    			add_location(small0, file$E, 77, 10, 1994);
    			attr_dev(div1, "class", "w3-card-2 w3-panel w3-hover-blue card svelte-dy5ndi");
    			add_location(div1, file$E, 70, 8, 1796);
    			attr_dev(b1, "class", "svelte-dy5ndi");
    			add_location(b1, file$E, 85, 10, 2245);
    			attr_dev(small1, "class", "svelte-dy5ndi");
    			add_location(small1, file$E, 86, 10, 2293);
    			attr_dev(div2, "class", "w3-card-2 w3-panel w3-hover-blue card svelte-dy5ndi");
    			add_location(div2, file$E, 79, 8, 2088);
    			add_location(div3, file$E, 69, 6, 1781);
    			add_location(div4, file$E, 89, 6, 2393);
    			attr_dev(div5, "class", "content w3-container svelte-dy5ndi");
    			add_location(div5, file$E, 64, 4, 1616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, b0);
    			append_dev(div1, t5);
    			append_dev(div1, small0);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, b1);
    			append_dev(div2, t9);
    			append_dev(div2, small1);
    			append_dev(div5, t11);
    			append_dev(div5, div4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div5_intro) {
    				add_render_callback(() => {
    					div5_intro = create_in_transition(div5, slide, {});
    					div5_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(64:2) {#if method === \\\"init\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let div0;
    	let tiarrowbackoutline;
    	let t;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	tiarrowbackoutline = new TiArrowBackOutline({ $$inline: true });
    	const if_block_creators = [create_if_block$a, create_if_block_1$6, create_if_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*method*/ ctx[0] === "init") return 0;
    		if (/*method*/ ctx[0] === "create") return 1;
    		if (/*method*/ ctx[0] === "join") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(tiarrowbackoutline.$$.fragment);
    			t = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "back svelte-dy5ndi");
    			add_location(div0, file$E, 58, 0, 1470);
    			attr_dev(div1, "class", "container w3-threequarter svelte-dy5ndi");
    			add_location(div1, file$E, 62, 0, 1544);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(tiarrowbackoutline, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*goBack*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tiarrowbackoutline.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tiarrowbackoutline.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(tiarrowbackoutline);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(7, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	console.log("i ran now");
    	let method = "init";
    	let step = 0;

    	function setUser(newUser) {
    		set_store_value(user, $user = newUser, $user);
    	}

    	function goBack() {
    		if (method === "init") {
    			navigate("/");
    		} else if (method === "create" || method === "join") {
    			if (step === 0) {
    				$$invalidate(0, method = "init");
    			} else {
    				$$invalidate(1, step = 0);
    			}
    		}
    	}

    	async function signup(e) {
    		const user = e.detail[0];
    		const company = e.detail[1];

    		const options = {
    			method: "POST",
    			headers: { "Content-type": "application/json" },
    			body: JSON.stringify({ user, company, method: "create" })
    		};

    		const response = await fetch("/signup", options);
    		const data = await response.json();

    		if (response.status === 201) {
    			setUser(data);
    			navigate("/");
    			toastr.success(data.email, "Velkommen,", { positionClass: "toast-top-left" });
    		} else {
    			(toastr.error(data.error, "Fejl"));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, method = "create");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, method = "join");
    	};

    	function create_step_binding(value) {
    		step = value;
    		$$invalidate(1, step);
    	}

    	$$self.$capture_state = () => ({
    		navigate,
    		Link,
    		TiArrowBackOutline,
    		user,
    		isLoading,
    		slide,
    		Create,
    		Join,
    		method,
    		step,
    		setUser,
    		goBack,
    		signup,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('method' in $$props) $$invalidate(0, method = $$props.method);
    		if ('step' in $$props) $$invalidate(1, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		method,
    		step,
    		goBack,
    		signup,
    		click_handler,
    		click_handler_1,
    		create_step_binding
    	];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src\Private\Home.svelte generated by Svelte v3.48.0 */
    const file$D = "src\\Private\\Home.svelte";

    function create_fragment$D(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Home";
    			add_location(h1, file$D, 5, 2, 146);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$D, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, slide, fly, scale });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src\Private\Schedule.svelte generated by Svelte v3.48.0 */
    const file$C = "src\\Private\\Schedule.svelte";

    function create_fragment$C(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Vagtplan";
    			add_location(h1, file$C, 5, 2, 146);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$C, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Schedule', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Schedule> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, slide, fly, scale });
    	return [];
    }

    class Schedule extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Schedule",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src\Private\Messages.svelte generated by Svelte v3.48.0 */
    const file$B = "src\\Private\\Messages.svelte";

    function create_fragment$B(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Beskeder";
    			add_location(h1, file$B, 5, 2, 133);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$B, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Messages', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Messages> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ slide, fly });
    	return [];
    }

    class Messages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src\Private\Employee\AddEmployee.svelte generated by Svelte v3.48.0 */

    const file$A = "src\\Private\\Employee\\AddEmployee.svelte";

    function create_fragment$A(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Add Employee";
    			add_location(h1, file$A, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddEmployee', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddEmployee> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class AddEmployee extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddEmployee",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* src\Private\Employee\EditEmployee.svelte generated by Svelte v3.48.0 */

    const file$z = "src\\Private\\Employee\\EditEmployee.svelte";

    function create_fragment$z(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Redigere";
    			add_location(h1, file$z, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditEmployee', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditEmployee> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class EditEmployee extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditEmployee",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src\Private\Employee\SearchEmployee.svelte generated by Svelte v3.48.0 */

    const file$y = "src\\Private\\Employee\\SearchEmployee.svelte";

    function create_fragment$y(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Søg";
    			add_location(h1, file$y, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchEmployee', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchEmployee> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SearchEmployee extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchEmployee",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* src\Private\Employees.svelte generated by Svelte v3.48.0 */
    const file$x = "src\\Private\\Employees.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (28:2) {#each list as item}
    function create_each_block$3(ctx) {
    	let span;
    	let t_value = /*item*/ ctx[5].displayname + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*item*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "w3-button svelte-o0umko");
    			toggle_class(span, "current", /*selected*/ ctx[0].name === /*item*/ ctx[5].name);
    			add_location(span, file$x, 28, 4, 874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selected, list*/ 5) {
    				toggle_class(span, "current", /*selected*/ ctx[0].name === /*item*/ ctx[5].name);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(28:2) {#each list as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let div0;
    	let h1;
    	let div0_intro;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let switch_instance;
    	let current;
    	let each_value = /*list*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	var switch_value = /*selectedComponent*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Medarbejder";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(h1, file$x, 24, 2, 796);
    			attr_dev(div0, "class", "w3-container container w3-card-4 svelte-o0umko");
    			add_location(div0, file$x, 23, 0, 737);
    			attr_dev(div1, "class", "tab svelte-o0umko");
    			add_location(div1, file$x, 26, 0, 826);
    			attr_dev(div2, "class", "content svelte-o0umko");
    			add_location(div2, file$x, 37, 0, 1074);
    			add_location(div3, file$x, 39, 0, 1101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected, list, selectTab*/ 13) {
    				each_value = /*list*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (switch_value !== (switch_value = /*selectedComponent*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div3, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, slide, {});
    					div0_intro.start();
    				});
    			}

    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let selectedComponent;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Employees', slots, []);

    	let list = [
    		{
    			name: "add",
    			displayname: "Tilføj",
    			component: AddEmployee
    		},
    		{
    			name: "edit",
    			displayname: "Redigere",
    			component: EditEmployee
    		},
    		{
    			name: "search",
    			displayname: "Søg",
    			component: SearchEmployee
    		}
    	];

    	let selected = list[0];

    	function selectTab(name) {
    		$$invalidate(0, selected = list.find(i => i.name === name));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Employees> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => {
    		selectTab(item.name);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		slide,
    		fly,
    		scale,
    		Router,
    		Route,
    		link,
    		AddEmployee,
    		EditEmployee,
    		SearchEmployee,
    		list,
    		selected,
    		selectTab,
    		selectedComponent
    	});

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(2, list = $$props.list);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selectedComponent' in $$props) $$invalidate(1, selectedComponent = $$props.selectedComponent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 1) {
    			$$invalidate(1, selectedComponent = selected.component);
    		}
    	};

    	return [selected, selectedComponent, list, selectTab, click_handler];
    }

    class Employees extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Employees",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src\Components\MySettings\General.svelte generated by Svelte v3.48.0 */

    const file$w = "src\\Components\\MySettings\\General.svelte";

    // (7:2) {#if isAdmin}
    function create_if_block$9(ctx) {
    	let p0;
    	let t1;
    	let input0;
    	let t2;
    	let p1;
    	let t4;
    	let input1;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Administrator";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Medarbejder";
    			t4 = space();
    			input1 = element("input");
    			add_location(p0, file$w, 7, 4, 112);
    			input0.value = "Ja";
    			attr_dev(input0, "class", "svelte-1vdgjub");
    			set_style(input0, "border", `none`, false);
    			add_location(input0, file$w, 8, 4, 138);
    			add_location(p1, file$w, 10, 4, 186);
    			input1.value = "0";
    			attr_dev(input1, "class", "svelte-1vdgjub");
    			set_style(input1, "border", `none`, false);
    			add_location(input1, file$w, 11, 4, 210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(7:2) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div;
    	let t0;
    	let p0;
    	let t2;
    	let input0;
    	let t3;
    	let p1;
    	let t5;
    	let input1;
    	let input1_value_value;
    	let t6;
    	let p2;
    	let t8;
    	let input2;
    	let input2_value_value;
    	let t9;
    	let p3;
    	let t11;
    	let input3;
    	let input3_value_value;
    	let t12;
    	let p4;
    	let t14;
    	let input4;
    	let input4_value_value;
    	let if_block = /*isAdmin*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Virksomhed";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Navn";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Email";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "Agangskode";
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "Mobil nummer";
    			t14 = space();
    			input4 = element("input");
    			add_location(p0, file$w, 14, 2, 264);
    			input0.readOnly = true;
    			input0.value = "Weeki";
    			attr_dev(input0, "class", "svelte-1vdgjub");
    			set_style(input0, "border", `none`, false);
    			add_location(input0, file$w, 15, 2, 285);
    			add_location(p1, file$w, 17, 2, 343);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*user*/ ctx[1].name || "ikke registeret";
    			attr_dev(input1, "class", "svelte-1vdgjub");
    			add_location(input1, file$w, 18, 2, 358);
    			add_location(p2, file$w, 20, 2, 424);
    			attr_dev(input2, "type", "email");
    			input2.value = input2_value_value = /*user*/ ctx[1].email;
    			attr_dev(input2, "class", "svelte-1vdgjub");
    			add_location(input2, file$w, 21, 2, 440);
    			add_location(p3, file$w, 23, 2, 487);
    			attr_dev(input3, "type", "password");
    			input3.value = input3_value_value = /*user*/ ctx[1].password;
    			attr_dev(input3, "class", "svelte-1vdgjub");
    			add_location(input3, file$w, 24, 2, 508);
    			add_location(p4, file$w, 26, 2, 561);
    			attr_dev(input4, "type", "number");
    			input4.value = input4_value_value = /*user*/ ctx[1].phone;
    			attr_dev(input4, "class", "svelte-1vdgjub");
    			add_location(input4, file$w, 27, 2, 584);
    			attr_dev(div, "class", "container svelte-1vdgjub");
    			add_location(div, file$w, 5, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, input0);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(div, t5);
    			append_dev(div, input1);
    			append_dev(div, t6);
    			append_dev(div, p2);
    			append_dev(div, t8);
    			append_dev(div, input2);
    			append_dev(div, t9);
    			append_dev(div, p3);
    			append_dev(div, t11);
    			append_dev(div, input3);
    			append_dev(div, t12);
    			append_dev(div, p4);
    			append_dev(div, t14);
    			append_dev(div, input4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isAdmin*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*user*/ 2 && input1_value_value !== (input1_value_value = /*user*/ ctx[1].name || "ikke registeret") && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*user*/ 2 && input2_value_value !== (input2_value_value = /*user*/ ctx[1].email) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty & /*user*/ 2 && input3_value_value !== (input3_value_value = /*user*/ ctx[1].password) && input3.value !== input3_value_value) {
    				prop_dev(input3, "value", input3_value_value);
    			}

    			if (dirty & /*user*/ 2 && input4_value_value !== (input4_value_value = /*user*/ ctx[1].phone) && input4.value !== input4_value_value) {
    				prop_dev(input4, "value", input4_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('General', slots, []);
    	let { isAdmin } = $$props;
    	let { user } = $$props;
    	const writable_props = ['isAdmin', 'user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<General> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(0, isAdmin = $$props.isAdmin);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({ isAdmin, user });

    	$$self.$inject_state = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(0, isAdmin = $$props.isAdmin);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isAdmin, user];
    }

    class General extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { isAdmin: 0, user: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isAdmin*/ ctx[0] === undefined && !('isAdmin' in props)) {
    			console.warn("<General> was created without expected prop 'isAdmin'");
    		}

    		if (/*user*/ ctx[1] === undefined && !('user' in props)) {
    			console.warn("<General> was created without expected prop 'user'");
    		}
    	}

    	get isAdmin() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAdmin(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user() {
    		throw new Error("<General>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<General>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\MySettings\App.svelte generated by Svelte v3.48.0 */
    const file$v = "src\\Components\\MySettings\\App.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (39:8) {#if theme.name !== "custom"}
    function create_if_block_1$5(ctx) {
    	let option;
    	let t_value = /*theme*/ ctx[12]["display-name"] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*theme*/ ctx[12].name;
    			option.value = option.__value;
    			add_location(option, file$v, 39, 10, 1035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*themes*/ 2 && t_value !== (t_value = /*theme*/ ctx[12]["display-name"] + "")) set_data_dev(t, t_value);

    			if (dirty & /*themes*/ 2 && option_value_value !== (option_value_value = /*theme*/ ctx[12].name)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(39:8) {#if theme.name !== \\\"custom\\\"}",
    		ctx
    	});

    	return block;
    }

    // (38:6) {#each themes as theme}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*theme*/ ctx[12].name !== "custom" && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*theme*/ ctx[12].name !== "custom") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(38:6) {#each themes as theme}",
    		ctx
    	});

    	return block;
    }

    // (64:46) {:else}
    function create_else_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Stop");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(64:46) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:7) {#if !playing}
    function create_if_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start Visual præsentation");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(64:7) {#if !playing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let div7;
    	let div4;
    	let b0;
    	let t1;
    	let p;
    	let t3;
    	let select;
    	let t4;
    	let div2;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let button0;
    	let t7;
    	let t8;
    	let div3;
    	let t9;
    	let div6;
    	let button1;
    	let t10;
    	let div5;
    	let b1;
    	let t11;
    	let mounted;
    	let dispose;
    	let each_value = /*themes*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (!/*playing*/ ctx[3]) return create_if_block$8;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div4 = element("div");
    			b0 = element("b");
    			b0.textContent = "Vælg en tema fra vores eget udvalg";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Tema";
    			t3 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			button0 = element("button");
    			t7 = text("Bekræft Tema");
    			t8 = space();
    			div3 = element("div");
    			t9 = space();
    			div6 = element("div");
    			button1 = element("button");
    			if_block.c();
    			t10 = space();
    			div5 = element("div");
    			b1 = element("b");
    			t11 = text(/*playingTheme*/ ctx[2]);
    			attr_dev(b0, "class", "intro svelte-o9uqj5");
    			add_location(b0, file$v, 29, 4, 750);
    			add_location(p, file$v, 31, 4, 813);
    			attr_dev(select, "default", localStorage.getItem("theme") || "default");
    			attr_dev(select, "class", "item svelte-o9uqj5");
    			if (/*selected*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[10].call(select));
    			add_location(select, file$v, 32, 4, 830);
    			attr_dev(div0, "class", "show-primary show svelte-o9uqj5");
    			set_style(div0, "background-color", /*show_primary*/ ctx[7], false);
    			add_location(div0, file$v, 44, 6, 1197);
    			attr_dev(div1, "class", "show-secondary show svelte-o9uqj5");
    			set_style(div1, "height", `45px`, false);
    			set_style(div1, "width", `50%`, false);
    			set_style(div1, "background-color", /*show_secondary*/ ctx[6], false);
    			add_location(div1, file$v, 45, 6, 1276);
    			attr_dev(div2, "class", "w3-border");
    			set_style(div2, "display", `flex`, false);
    			add_location(div2, file$v, 43, 4, 1145);
    			attr_dev(button0, "class", "w3-button w3-hover w3-hover-black confirm");
    			button0.disabled = /*playing*/ ctx[3];
    			set_style(button0, "background-color", /*selectedTheme*/ ctx[4].primary, false);
    			set_style(button0, "color", /*selectedTheme*/ ctx[4].text, false);
    			add_location(button0, file$v, 52, 4, 1450);
    			add_location(div3, file$v, 59, 4, 1684);
    			attr_dev(div4, "class", "container pick-container svelte-o9uqj5");
    			add_location(div4, file$v, 28, 2, 706);
    			attr_dev(button1, "class", "w3-button r play-button svelte-o9uqj5");
    			add_location(button1, file$v, 62, 4, 1749);
    			add_location(b1, file$v, 66, 6, 1970);
    			attr_dev(div5, "class", "content svelte-o9uqj5");
    			set_style(div5, "background-color", /*show_playing_primary*/ ctx[5], false);
    			add_location(div5, file$v, 65, 4, 1895);
    			attr_dev(div6, "class", "container play-container svelte-o9uqj5");
    			add_location(div6, file$v, 61, 2, 1705);
    			attr_dev(div7, "class", "main svelte-o9uqj5");
    			add_location(div7, file$v, 27, 0, 684);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div4, b0);
    			append_dev(div4, t1);
    			append_dev(div4, p);
    			append_dev(div4, t3);
    			append_dev(div4, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selected*/ ctx[0]);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div4, t6);
    			append_dev(div4, button0);
    			append_dev(button0, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, button1);
    			if_block.m(button1, null);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, b1);
    			append_dev(b1, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[10]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(button1, "click", /*playThemes*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*themes*/ 2) {
    				each_value = /*themes*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected, themes*/ 3) {
    				select_option(select, /*selected*/ ctx[0]);
    			}

    			if (dirty & /*show_primary*/ 128) {
    				set_style(div0, "background-color", /*show_primary*/ ctx[7], false);
    			}

    			if (dirty & /*show_secondary*/ 64) {
    				set_style(div1, "background-color", /*show_secondary*/ ctx[6], false);
    			}

    			if (dirty & /*playing*/ 8) {
    				prop_dev(button0, "disabled", /*playing*/ ctx[3]);
    			}

    			if (dirty & /*selectedTheme*/ 16) {
    				set_style(button0, "background-color", /*selectedTheme*/ ctx[4].primary, false);
    			}

    			if (dirty & /*selectedTheme*/ 16) {
    				set_style(button0, "color", /*selectedTheme*/ ctx[4].text, false);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button1, null);
    				}
    			}

    			if (dirty & /*playingTheme*/ 4) set_data_dev(t11, /*playingTheme*/ ctx[2]);

    			if (dirty & /*show_playing_primary*/ 32) {
    				set_style(div5, "background-color", /*show_playing_primary*/ ctx[5], false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let playing;
    	let selectedTheme;
    	let show_primary;
    	let show_secondary;
    	let show_playing_primary;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const dispatch = createEventDispatcher();
    	let { themes } = $$props;
    	let { selected } = $$props;
    	let { playingTheme = "" } = $$props;

    	function playThemes() {
    		$$invalidate(3, playing = !playing);

    		if (playing) {
    			dispatch("playTheme", true);
    		} else {
    			dispatch("playTheme", false);
    		}
    	}

    	const writable_props = ['themes', 'selected', 'playingTheme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate(0, selected);
    		$$invalidate(1, themes);
    	}

    	$$self.$$set = $$props => {
    		if ('themes' in $$props) $$invalidate(1, themes = $$props.themes);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('playingTheme' in $$props) $$invalidate(2, playingTheme = $$props.playingTheme);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		themes,
    		selected,
    		playingTheme,
    		playThemes,
    		playing,
    		show_playing_primary,
    		selectedTheme,
    		show_secondary,
    		show_primary
    	});

    	$$self.$inject_state = $$props => {
    		if ('themes' in $$props) $$invalidate(1, themes = $$props.themes);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('playingTheme' in $$props) $$invalidate(2, playingTheme = $$props.playingTheme);
    		if ('playing' in $$props) $$invalidate(3, playing = $$props.playing);
    		if ('show_playing_primary' in $$props) $$invalidate(5, show_playing_primary = $$props.show_playing_primary);
    		if ('selectedTheme' in $$props) $$invalidate(4, selectedTheme = $$props.selectedTheme);
    		if ('show_secondary' in $$props) $$invalidate(6, show_secondary = $$props.show_secondary);
    		if ('show_primary' in $$props) $$invalidate(7, show_primary = $$props.show_primary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*playingTheme*/ 4) {
    			$$invalidate(3, playing = playingTheme !== "" ? true : false);
    		}

    		if ($$self.$$.dirty & /*themes, selected*/ 3) {
    			$$invalidate(4, selectedTheme = themes.find(th => th.name === selected));
    		}

    		if ($$self.$$.dirty & /*playing, selectedTheme*/ 24) {
    			$$invalidate(7, show_primary = playing ? "" : selectedTheme.primary || "");
    		}

    		if ($$self.$$.dirty & /*playing, selectedTheme*/ 24) {
    			$$invalidate(6, show_secondary = playing ? "" : selectedTheme.secondary || "");
    		}

    		if ($$self.$$.dirty & /*playing*/ 8) {
    			$$invalidate(5, show_playing_primary = playing ? "" : "#fff");
    		}
    	};

    	return [
    		selected,
    		themes,
    		playingTheme,
    		playing,
    		selectedTheme,
    		show_playing_primary,
    		show_secondary,
    		show_primary,
    		playThemes,
    		click_handler,
    		select_change_handler
    	];
    }

    class App$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { themes: 1, selected: 0, playingTheme: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*themes*/ ctx[1] === undefined && !('themes' in props)) {
    			console.warn("<App> was created without expected prop 'themes'");
    		}

    		if (/*selected*/ ctx[0] === undefined && !('selected' in props)) {
    			console.warn("<App> was created without expected prop 'selected'");
    		}
    	}

    	get themes() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set themes(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get playingTheme() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playingTheme(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Private\MySettings.svelte generated by Svelte v3.48.0 */
    const file$u = "src\\Private\\MySettings.svelte";

    // (97:31) 
    function create_if_block_2$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "mere";
    			add_location(h1, file$u, 97, 4, 2499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(97:31) ",
    		ctx
    	});

    	return block;
    }

    // (87:30) 
    function create_if_block_1$4(ctx) {
    	let div;
    	let app;
    	let updating_selected;
    	let updating_playingTheme;
    	let div_intro;
    	let current;

    	function app_selected_binding(value) {
    		/*app_selected_binding*/ ctx[11](value);
    	}

    	function app_playingTheme_binding(value) {
    		/*app_playingTheme_binding*/ ctx[12](value);
    	}

    	let app_props = { themes: /*$themes*/ ctx[3] };

    	if (/*selected*/ ctx[1] !== void 0) {
    		app_props.selected = /*selected*/ ctx[1];
    	}

    	if (/*playingTheme*/ ctx[2] !== void 0) {
    		app_props.playingTheme = /*playingTheme*/ ctx[2];
    	}

    	app = new App$1({ props: app_props, $$inline: true });
    	binding_callbacks.push(() => bind(app, 'selected', app_selected_binding));
    	binding_callbacks.push(() => bind(app, 'playingTheme', app_playingTheme_binding));
    	app.$on("click", /*changeTheme*/ ctx[6]);
    	app.$on("playTheme", /*playTheme*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(app.$$.fragment);
    			add_location(div, file$u, 87, 4, 2270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(app, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const app_changes = {};
    			if (dirty & /*$themes*/ 8) app_changes.themes = /*$themes*/ ctx[3];

    			if (!updating_selected && dirty & /*selected*/ 2) {
    				updating_selected = true;
    				app_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_playingTheme && dirty & /*playingTheme*/ 4) {
    				updating_playingTheme = true;
    				app_changes.playingTheme = /*playingTheme*/ ctx[2];
    				add_flush_callback(() => updating_playingTheme = false);
    			}

    			app.$set(app_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(app.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(app.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(app);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(87:30) ",
    		ctx
    	});

    	return block;
    }

    // (83:2) {#if current === "general"}
    function create_if_block$7(ctx) {
    	let div;
    	let general;
    	let div_intro;
    	let current;

    	general = new General({
    			props: {
    				isAdmin: /*$isAdmin*/ ctx[4],
    				user: /*$user*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(general.$$.fragment);
    			add_location(div, file$u, 83, 4, 2155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(general, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};
    			if (dirty & /*$isAdmin*/ 16) general_changes.isAdmin = /*$isAdmin*/ ctx[4];
    			if (dirty & /*$user*/ 32) general_changes.user = /*$user*/ ctx[5];
    			general.$set(general_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(general.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(general.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(general);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(83:2) {#if current === \\\"general\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div0;
    	let h1;
    	let div0_intro;
    	let t1;
    	let div1;
    	let span0;
    	let t3;
    	let span1;
    	let t5;
    	let span2;
    	let t7;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_if_block_1$4, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*current*/ ctx[0] === "general") return 0;
    		if (/*current*/ ctx[0] === "app") return 1;
    		if (/*current*/ ctx[0] === "mere") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Mine indstillinger";
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "General";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "App";
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "mere";
    			t7 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			add_location(h1, file$u, 61, 2, 1570);
    			attr_dev(div0, "class", "w3-container container w3-card-4 svelte-ad22x7");
    			add_location(div0, file$u, 60, 0, 1511);
    			attr_dev(span0, "class", "w3-button w3-hover-light-grey svelte-ad22x7");
    			toggle_class(span0, "active", /*current*/ ctx[0] === "general");
    			add_location(span0, file$u, 64, 2, 1628);
    			attr_dev(span1, "class", "w3-button w3-hover-light-grey svelte-ad22x7");
    			toggle_class(span1, "active", /*current*/ ctx[0] === "app");
    			add_location(span1, file$u, 69, 2, 1786);
    			attr_dev(span2, "class", "w3-button w3-hover-light-grey svelte-ad22x7");
    			toggle_class(span2, "active", /*current*/ ctx[0] === "mere");
    			add_location(span2, file$u, 74, 2, 1931);
    			attr_dev(div1, "class", "tab svelte-ad22x7");
    			add_location(div1, file$u, 63, 0, 1607);
    			attr_dev(div2, "class", "content-container svelte-ad22x7");
    			add_location(div2, file$u, 81, 0, 2087);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(div1, t3);
    			append_dev(div1, span1);
    			append_dev(div1, t5);
    			append_dev(div1, span2);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div2, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(span1, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(span2, "click", /*click_handler_2*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*current*/ 1) {
    				toggle_class(span0, "active", /*current*/ ctx[0] === "general");
    			}

    			if (dirty & /*current*/ 1) {
    				toggle_class(span1, "active", /*current*/ ctx[0] === "app");
    			}

    			if (dirty & /*current*/ 1) {
    				toggle_class(span2, "active", /*current*/ ctx[0] === "mere");
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, slide, {});
    					div0_intro.start();
    				});
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $themes;
    	let $theme;
    	let $isAdmin;
    	let $user;
    	validate_store(themes, 'themes');
    	component_subscribe($$self, themes, $$value => $$invalidate(3, $themes = $$value));
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(16, $theme = $$value));
    	validate_store(isAdmin, 'isAdmin');
    	component_subscribe($$self, isAdmin, $$value => $$invalidate(4, $isAdmin = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MySettings', slots, []);
    	let current = "app";
    	let selected = $theme;
    	let playingTheme = "";
    	let playingThemeName = "";

    	function setTheme() {
    		set_store_value(theme, $theme = playingThemeName, $theme);
    	}

    	function changeTheme() {
    		localStorage.setItem("theme", selected);
    		set_store_value(theme, $theme = selected, $theme);
    	}

    	let playInterval;
    	let count = 0;

    	function playTheme(e) {
    		//either true or false
    		//cannot be false without having been true
    		//false would mean to stop the ongoing play
    		//make sure themes is not empty | very unlikely
    		//and to clear the interval after there is no more themes in array
    		//the last is a custom theme
    		if (e.detail) {
    			playInterval = setInterval(
    				() => {
    					if (count < $themes.length - 1) {
    						const theme = $themes[count];
    						count++;
    						$$invalidate(2, playingTheme = theme["display-name"]);
    						playingThemeName = theme.name;
    						setTheme();
    					} else {
    						clearInterval(playInterval);
    						count = 0;
    						$$invalidate(2, playingTheme = "");
    						changeTheme();
    					}
    				},
    				2000
    			);
    		} else {
    			clearInterval(playInterval);
    		}

    		count = 0;
    		$$invalidate(2, playingTheme = "");
    		changeTheme();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MySettings> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, current = "general");
    	const click_handler_1 = () => $$invalidate(0, current = "app");
    	const click_handler_2 = () => $$invalidate(0, current = "mere");

    	function app_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	function app_playingTheme_binding(value) {
    		playingTheme = value;
    		$$invalidate(2, playingTheme);
    	}

    	$$self.$capture_state = () => ({
    		slide,
    		scale,
    		themes,
    		theme,
    		user,
    		isAdmin,
    		General,
    		App: App$1,
    		current,
    		selected,
    		playingTheme,
    		playingThemeName,
    		setTheme,
    		changeTheme,
    		playInterval,
    		count,
    		playTheme,
    		$themes,
    		$theme,
    		$isAdmin,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('playingTheme' in $$props) $$invalidate(2, playingTheme = $$props.playingTheme);
    		if ('playingThemeName' in $$props) playingThemeName = $$props.playingThemeName;
    		if ('playInterval' in $$props) playInterval = $$props.playInterval;
    		if ('count' in $$props) count = $$props.count;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		current,
    		selected,
    		playingTheme,
    		$themes,
    		$isAdmin,
    		$user,
    		changeTheme,
    		playTheme,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		app_selected_binding,
    		app_playingTheme_binding
    	];
    }

    class MySettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MySettings",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\NotFound.svelte generated by Svelte v3.48.0 */
    const file$t = "src\\NotFound.svelte";

    function create_fragment$t(ctx) {
    	let div0;
    	let h1;
    	let div0_intro;
    	let t1;
    	let div2;
    	let b;
    	let t3;
    	let div1;
    	let h2;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Page not found | Access Denied";
    			t1 = space();
    			div2 = element("div");
    			b = element("b");
    			b.textContent = "You either do not have access to this page or the page does not exist";
    			t3 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t4 = text("Redirecting in... ");
    			t5 = text(/*counter*/ ctx[0]);
    			add_location(h1, file$t, 18, 2, 427);
    			attr_dev(div0, "class", "w3-container container svelte-1nvj3d4");
    			add_location(div0, file$t, 17, 0, 378);
    			add_location(b, file$t, 22, 2, 526);
    			add_location(h2, file$t, 25, 4, 660);
    			attr_dev(div1, "class", "w3-container w3-large w3-section");
    			add_location(div1, file$t, 24, 2, 608);
    			attr_dev(div2, "class", "w3-container w3-border content svelte-1nvj3d4");
    			add_location(div2, file$t, 21, 0, 478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, b);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t4);
    			append_dev(h2, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*counter*/ 1) set_data_dev(t5, /*counter*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, slide, {});
    					div0_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $page;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	let counter = 5;
    	const dcr = () => $$invalidate(0, counter -= 1);
    	let clear = setInterval(dcr, 1000);

    	setTimeout(
    		() => {
    			clearInterval(clear);
    			set_store_value(page, $page = "/", $page);
    			navigate("/", { replace: true });
    		},
    		5000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		navigate,
    		slide,
    		page,
    		counter,
    		dcr,
    		clear,
    		$page
    	});

    	$$self.$inject_state = $$props => {
    		if ('counter' in $$props) $$invalidate(0, counter = $$props.counter);
    		if ('clear' in $$props) clear = $$props.clear;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [counter];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Circle2.svelte generated by Svelte v3.48.0 */

    const file$s = "node_modules\\svelte-loading-spinners\\dist\\Circle2.svelte";

    function create_fragment$s(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "circle svelte-1vclic6");
    			set_style(div, "--size", /*size*/ ctx[0] + /*unit*/ ctx[1]);
    			set_style(div, "--colorInner", /*colorInner*/ ctx[4]);
    			set_style(div, "--colorCenter", /*colorCenter*/ ctx[3]);
    			set_style(div, "--colorOuter", /*colorOuter*/ ctx[2]);
    			set_style(div, "--durationInner", /*durationInner*/ ctx[6]);
    			set_style(div, "--durationCenter", /*durationCenter*/ ctx[7]);
    			set_style(div, "--durationOuter", /*durationOuter*/ ctx[5]);
    			add_location(div, file$s, 56, 0, 1412);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 3) {
    				set_style(div, "--size", /*size*/ ctx[0] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*colorInner*/ 16) {
    				set_style(div, "--colorInner", /*colorInner*/ ctx[4]);
    			}

    			if (dirty & /*colorCenter*/ 8) {
    				set_style(div, "--colorCenter", /*colorCenter*/ ctx[3]);
    			}

    			if (dirty & /*colorOuter*/ 4) {
    				set_style(div, "--colorOuter", /*colorOuter*/ ctx[2]);
    			}

    			if (dirty & /*durationInner*/ 64) {
    				set_style(div, "--durationInner", /*durationInner*/ ctx[6]);
    			}

    			if (dirty & /*durationCenter*/ 128) {
    				set_style(div, "--durationCenter", /*durationCenter*/ ctx[7]);
    			}

    			if (dirty & /*durationOuter*/ 32) {
    				set_style(div, "--durationOuter", /*durationOuter*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Circle2', slots, []);
    	let { size = "60" } = $$props;
    	let { unit = "px" } = $$props;
    	let { colorOuter = "#FF3E00" } = $$props;
    	let { colorCenter = "#40B3FF" } = $$props;
    	let { colorInner = "#676778" } = $$props;
    	let { durationMultiplier = 1 } = $$props;
    	let { durationOuter = `${durationMultiplier * 2}s` } = $$props;
    	let { durationInner = `${durationMultiplier * 1.5}s` } = $$props;
    	let { durationCenter = `${durationMultiplier * 3}s` } = $$props;

    	const writable_props = [
    		'size',
    		'unit',
    		'colorOuter',
    		'colorCenter',
    		'colorInner',
    		'durationMultiplier',
    		'durationOuter',
    		'durationInner',
    		'durationCenter'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Circle2> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('colorOuter' in $$props) $$invalidate(2, colorOuter = $$props.colorOuter);
    		if ('colorCenter' in $$props) $$invalidate(3, colorCenter = $$props.colorCenter);
    		if ('colorInner' in $$props) $$invalidate(4, colorInner = $$props.colorInner);
    		if ('durationMultiplier' in $$props) $$invalidate(8, durationMultiplier = $$props.durationMultiplier);
    		if ('durationOuter' in $$props) $$invalidate(5, durationOuter = $$props.durationOuter);
    		if ('durationInner' in $$props) $$invalidate(6, durationInner = $$props.durationInner);
    		if ('durationCenter' in $$props) $$invalidate(7, durationCenter = $$props.durationCenter);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		unit,
    		colorOuter,
    		colorCenter,
    		colorInner,
    		durationMultiplier,
    		durationOuter,
    		durationInner,
    		durationCenter
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('colorOuter' in $$props) $$invalidate(2, colorOuter = $$props.colorOuter);
    		if ('colorCenter' in $$props) $$invalidate(3, colorCenter = $$props.colorCenter);
    		if ('colorInner' in $$props) $$invalidate(4, colorInner = $$props.colorInner);
    		if ('durationMultiplier' in $$props) $$invalidate(8, durationMultiplier = $$props.durationMultiplier);
    		if ('durationOuter' in $$props) $$invalidate(5, durationOuter = $$props.durationOuter);
    		if ('durationInner' in $$props) $$invalidate(6, durationInner = $$props.durationInner);
    		if ('durationCenter' in $$props) $$invalidate(7, durationCenter = $$props.durationCenter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		unit,
    		colorOuter,
    		colorCenter,
    		colorInner,
    		durationOuter,
    		durationInner,
    		durationCenter,
    		durationMultiplier
    	];
    }

    class Circle2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			size: 0,
    			unit: 1,
    			colorOuter: 2,
    			colorCenter: 3,
    			colorInner: 4,
    			durationMultiplier: 8,
    			durationOuter: 5,
    			durationInner: 6,
    			durationCenter: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Circle2",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get size() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorOuter() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorOuter(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorCenter() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorCenter(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorInner() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorInner(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get durationMultiplier() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set durationMultiplier(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get durationOuter() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set durationOuter(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get durationInner() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set durationInner(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get durationCenter() {
    		throw new Error("<Circle2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set durationCenter(value) {
    		throw new Error("<Circle2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Loader.svelte generated by Svelte v3.48.0 */
    const file$r = "src\\Components\\Loader.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let circle2;
    	let current;

    	circle2 = new Circle2({
    			props: {
    				size: "80",
    				colorOuter: /*styles*/ ctx[0].outer,
    				colorCenter: /*styles*/ ctx[0].center,
    				colorInner: /*styles*/ ctx[0].outer
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(circle2.$$.fragment);
    			attr_dev(div, "class", "container w3-border svelte-w7b0p0");
    			add_location(div, file$r, 7, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(circle2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const circle2_changes = {};
    			if (dirty & /*styles*/ 1) circle2_changes.colorOuter = /*styles*/ ctx[0].outer;
    			if (dirty & /*styles*/ 1) circle2_changes.colorCenter = /*styles*/ ctx[0].center;
    			if (dirty & /*styles*/ 1) circle2_changes.colorInner = /*styles*/ ctx[0].outer;
    			circle2.$set(circle2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(circle2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(circle2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { styles = { outer: "#0088ff", center: "#000" } } = $$props;
    	const writable_props = ['styles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    	};

    	$$self.$capture_state = () => ({ Circle2, styles });

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [styles];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { styles: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get styles() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Logo.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$q = "src\\Components\\Logo.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let span;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "W";
    			t1 = space();
    			p = element("p");
    			p.textContent = "eeki";
    			attr_dev(span, "class", "svelte-k33ykr");
    			add_location(span, file$q, 40, 2, 828);
    			attr_dev(p, "class", "svelte-k33ykr");
    			add_location(p, file$q, 41, 2, 846);
    			attr_dev(div, "id", "logo");
    			attr_dev(div, "style", /*logoStyles*/ ctx[0]);
    			attr_dev(div, "class", "svelte-k33ykr");
    			add_location(div, file$q, 39, 0, 790);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*logoStyles*/ 1) {
    				attr_dev(div, "style", /*logoStyles*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let styles;
    	let logoStyles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { size } = $$props;

    	//the logo is going to be in 3 sizes, additionaly size can be added later
    	//small -footer
    	//medium - navBar
    	//large - Intro logo /login
    	//chage the font family of the logo
    	let font_family = "";

    	//default
    	let w_size;

    	let eeki_size;
    	const writable_props = ['size'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		font_family,
    		w_size,
    		eeki_size,
    		styles,
    		logoStyles
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('font_family' in $$props) font_family = $$props.font_family;
    		if ('w_size' in $$props) $$invalidate(2, w_size = $$props.w_size);
    		if ('eeki_size' in $$props) $$invalidate(3, eeki_size = $$props.eeki_size);
    		if ('styles' in $$props) $$invalidate(4, styles = $$props.styles);
    		if ('logoStyles' in $$props) $$invalidate(0, logoStyles = $$props.logoStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 2) {
    			if (size === "L") {
    				$$invalidate(2, w_size = "156px");
    				$$invalidate(3, eeki_size = "106px");
    			} else if (size === "M") {
    				$$invalidate(2, w_size = "76px");
    				$$invalidate(3, eeki_size = "46px");
    			} else if (size === "S") {
    				$$invalidate(2, w_size = "36px");
    				$$invalidate(3, eeki_size = "16px");
    			} else {
    				$$invalidate(2, w_size = "56px");
    				$$invalidate(3, eeki_size = "36px");
    			}
    		}

    		if ($$self.$$.dirty & /*w_size, eeki_size*/ 12) {
    			$$invalidate(4, styles = { "w-size": w_size, "eeki-size": eeki_size });
    		}

    		if ($$self.$$.dirty & /*styles*/ 16) {
    			$$invalidate(0, logoStyles = Object.entries(styles).map(([key, value]) => `--${key}: ${value}`).join(";"));
    		}
    	};

    	return [logoStyles, size, w_size, eeki_size, styles];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Logo> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Layouts\Public.svelte generated by Svelte v3.48.0 */
    const file$p = "src\\Layouts\\Public.svelte";

    // (42:4) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(42:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if $isLoading}
    function create_if_block$6(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(40:4) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div2;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div1;
    	let logo;
    	let updating_size;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLoading*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function logo_size_binding(value) {
    		/*logo_size_binding*/ ctx[7](value);
    	}

    	let logo_props = {};

    	if (/*size*/ ctx[1] !== void 0) {
    		logo_props.size = /*size*/ ctx[1];
    	}

    	logo = new Logo({ props: logo_props, $$inline: true });
    	binding_callbacks.push(() => bind(logo, 'size', logo_size_binding));

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t = space();
    			div1 = element("div");
    			create_component(logo.$$.fragment);
    			attr_dev(div0, "class", "content w3-half container svelte-19z8aw1");
    			add_location(div0, file$p, 38, 2, 1308);
    			attr_dev(div1, "id", "logo");
    			attr_dev(div1, "class", "logo w3-half w3-black container w3-hide-small svelte-19z8aw1");
    			add_location(div1, file$p, 45, 2, 1441);
    			attr_dev(div2, "class", "main w3-row svelte-19z8aw1");
    			attr_dev(div2, "style", /*styles*/ ctx[3]);
    			add_location(div2, file$p, 37, 0, 1264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(logo, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}

    			const logo_changes = {};

    			if (!updating_size && dirty & /*size*/ 2) {
    				updating_size = true;
    				logo_changes.size = /*size*/ ctx[1];
    				add_flush_callback(() => updating_size = false);
    			}

    			logo.$set(logo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			destroy_component(logo);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function clicked() {
    	
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $isLoading;
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(2, $isLoading = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Public', slots, ['default']);
    	const styles = `--secondary-color: #0088ff;`;

    	/**
     * Reative logo for smaller screens
     * by binding the svelte:windows property innerWidth
     * the size of width is available to do some logic with
     * if the screen is smaller than 900 and equal to 'L': this is done to not run the code infinitly when the screen is smaller than 900
     * the same for bigger than 900 and equal to 'M'
     */
    	let width;

    	let size = "L";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Public> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, width = window.innerWidth);
    	}

    	function logo_size_binding(value) {
    		size = value;
    		($$invalidate(1, size), $$invalidate(0, width));
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Logo,
    		Loader,
    		isLoading,
    		styles,
    		width,
    		size,
    		clicked,
    		$isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, size*/ 3) {
    			if (width < 900 && size === "L") {
    				$$invalidate(1, size = "M");
    			} else if (width > 900 && size === "M") {
    				$$invalidate(1, size = "L");
    			}
    		}
    	};

    	return [
    		width,
    		size,
    		$isLoading,
    		styles,
    		$$scope,
    		slots,
    		onwindowresize,
    		logo_size_binding
    	];
    }

    class Public extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Public",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiHomeOutline.svelte generated by Svelte v3.48.0 */
    const file$o = "node_modules\\svelte-icons\\ti\\TiHomeOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$f(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M22.262 10.468c-3.39-2.854-9.546-8.171-9.607-8.225l-.655-.563-.652.563c-.062.053-6.221 5.368-9.66 8.248-.438.394-.688.945-.688 1.509 0 1.104.896 2 2 2h1v6c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-6h1c1.104 0 2-.896 2-2 0-.598-.275-1.161-.738-1.532zm-8.262 9.532h-4v-5h4v5zm4-8l.002 8h-3.002v-6h-6v6h-3v-8h-3.001c2.765-2.312 7.315-6.227 9.001-7.68 1.686 1.453 6.234 5.367 9 7.681l-3-.001z");
    			add_location(path, file$o, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$f] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiHomeOutline', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class TiHomeOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiHomeOutline",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* node_modules\svelte-icons\md\MdSchedule.svelte generated by Svelte v3.48.0 */
    const file$n = "node_modules\\svelte-icons\\md\\MdSchedule.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$e(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z");
    			add_location(path, file$n, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$e] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MdSchedule', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class MdSchedule extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MdSchedule",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosChatboxes.svelte generated by Svelte v3.48.0 */
    const file$m = "node_modules\\svelte-icons\\io\\IoIosChatboxes.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$d(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M425.9 170.4H204.3c-21 0-38.1 17.1-38.1 38.1v154.3c0 21 17.1 38 38.1 38h126.8c2.8 0 5.6 1.2 7.6 3.2l63 58.1c3.5 3.4 9.3 2 9.3-2.9v-50.6c0-6 3.8-7.9 9.8-7.9h1c21 0 42.1-16.9 42.1-38V208.5c.1-21.1-17-38.1-38-38.1z");
    			add_location(path0, file$m, 4, 10, 153);
    			attr_dev(path1, "d", "M174.4 145.9h177.4V80.6c0-18-14.6-32.6-32.6-32.6H80.6C62.6 48 48 62.6 48 80.6v165.2c0 18 14.6 32.6 32.6 32.6h61.1v-99.9c.1-18 14.7-32.6 32.7-32.6z");
    			add_location(path1, file$m, 5, 0, 378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$d] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosChatboxes', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosChatboxes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosChatboxes",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosClose.svelte generated by Svelte v3.48.0 */
    const file$l = "node_modules\\svelte-icons\\io\\IoIosClose.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$c(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z");
    			add_location(path, file$l, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$c] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosClose', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosClose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosClose",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosPeople.svelte generated by Svelte v3.48.0 */
    const file$k = "node_modules\\svelte-icons\\io\\IoIosPeople.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$b(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M349.1 334.7c-11.2-4-29.5-4.2-37.6-7.3-5.6-2.2-14.5-4.6-17.4-8.1-2.9-3.5-2.9-28.5-2.9-28.5s7-6.6 9.9-14c2.9-7.3 4.8-27.5 4.8-27.5s6.6 2.8 9.2-10.4c2.2-11.4 6.4-17.4 5.3-25.8-1.2-8.4-5.8-6.4-5.8-6.4s5.8-8.5 5.8-37.4c0-29.8-22.5-59.1-64.6-59.1-42 0-64.7 29.4-64.7 59.1 0 28.9 5.7 37.4 5.7 37.4s-4.7-2-5.8 6.4c-1.2 8.4 3 14.4 5.3 25.8 2.6 13.3 9.2 10.4 9.2 10.4s1.9 20.1 4.8 27.5c2.9 7.4 9.9 14 9.9 14s0 25-2.9 28.5-11.8 5.9-17.4 8c-8 3.1-26.3 3.5-37.6 7.5-11.2 4-45.8 22.2-45.8 67.2h278.3c.1-45.1-34.5-63.3-45.7-67.3z");
    			add_location(path0, file$k, 4, 10, 153);
    			attr_dev(path1, "d", "M140 286s23.9-.8 33.4-9.3c-15.5-23.5-7.1-50.9-10.3-76.5-3.2-25.5-17.7-40.8-46.7-40.8h-.4c-28 0-43.1 15.2-46.3 40.8-3.2 25.5 5.7 56-10.2 76.5C69 285.3 93 285 93 285s1 14.4-1 16.8c-2 2.4-7.9 4.7-12 5.5-8.8 1.9-18.1 4.5-25.9 7.2-7.8 2.7-22.6 17.2-22.6 37.2h80.3c2.2-8 17.3-22.3 32-29.8 9-4.6 17.9-4.3 24.7-5.2 0 0 3.8-6-8.7-8.3 0 0-17.2-4.3-19.2-6.7-1.9-2.2-.6-15.7-.6-15.7zM372 286s-23.9-.8-33.4-9.3c15.5-23.5 7.1-50.9 10.3-76.5 3.2-25.5 17.7-40.8 46.7-40.8h.4c28 0 43.1 15.2 46.3 40.8 3.2 25.5-5.7 56 10.2 76.5-9.5 8.6-33.5 8.3-33.5 8.3s-1 14.4 1 16.8c2 2.4 7.9 4.7 12 5.5 8.8 1.9 18.1 4.5 25.9 7.2 7.8 2.7 22.6 17.2 22.6 37.2h-80.3c-2.2-8-17.3-22.3-32-29.8-9-4.6-17.9-4.3-24.7-5.2 0 0-3.8-6 8.7-8.3 0 0 17.2-4.3 19.2-6.7 1.9-2.2.6-15.7.6-15.7z");
    			add_location(path1, file$k, 5, 0, 682);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$b] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosPeople', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosPeople extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosPeople",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiArrowSortedUp.svelte generated by Svelte v3.48.0 */
    const file$j = "node_modules\\svelte-icons\\ti\\TiArrowSortedUp.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$a(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M18.2 13.3l-6.2-6.3-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7z");
    			add_location(path, file$j, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$a] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiArrowSortedUp', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class TiArrowSortedUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiArrowSortedUp",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosSettings.svelte generated by Svelte v3.48.0 */
    const file$i = "node_modules\\svelte-icons\\io\\IoIosSettings.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$9(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M416.3 256c0-21 13.1-38.9 31.7-46.1-4.9-20.5-13-39.7-23.7-57.1-6.4 2.8-13.2 4.3-20.1 4.3-12.6 0-25.2-4.8-34.9-14.4-14.9-14.9-18.2-36.8-10.2-55-17.3-10.7-36.6-18.8-57-23.7C295 82.5 277 95.7 256 95.7S217 82.5 209.9 64c-20.5 4.9-39.7 13-57.1 23.7 8.1 18.1 4.7 40.1-10.2 55-9.6 9.6-22.3 14.4-34.9 14.4-6.9 0-13.7-1.4-20.1-4.3C77 170.3 68.9 189.5 64 210c18.5 7.1 31.7 25 31.7 46.1 0 21-13.1 38.9-31.6 46.1 4.9 20.5 13 39.7 23.7 57.1 6.4-2.8 13.2-4.2 20-4.2 12.6 0 25.2 4.8 34.9 14.4 14.8 14.8 18.2 36.8 10.2 54.9 17.4 10.7 36.7 18.8 57.1 23.7 7.1-18.5 25-31.6 46-31.6s38.9 13.1 46 31.6c20.5-4.9 39.7-13 57.1-23.7-8-18.1-4.6-40 10.2-54.9 9.6-9.6 22.2-14.4 34.9-14.4 6.8 0 13.7 1.4 20 4.2 10.7-17.4 18.8-36.7 23.7-57.1-18.4-7.2-31.6-25.1-31.6-46.2zm-159.4 79.9c-44.3 0-80-35.9-80-80s35.7-80 80-80 80 35.9 80 80-35.7 80-80 80z");
    			add_location(path, file$i, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosSettings', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosSettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosSettings",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiMessage.svelte generated by Svelte v3.48.0 */
    const file$h = "node_modules\\svelte-icons\\ti\\TiMessage.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$8(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M18 7c.542 0 1 .458 1 1v7c0 .542-.458 1-1 1h-8.829l-.171.171v-.171h-3c-.542 0-1-.458-1-1v-7c0-.542.458-1 1-1h12m0-2h-12c-1.65 0-3 1.35-3 3v7c0 1.65 1.35 3 3 3h1v3l3-3h8c1.65 0 3-1.35 3-3v-7c0-1.65-1.35-3-3-3z");
    			add_location(path, file$h, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$8] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiMessage', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class TiMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiMessage",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosHelpCircleOutline.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules\\svelte-icons\\io\\IoIosHelpCircleOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$7(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z");
    			add_location(path0, file$g, 4, 10, 153);
    			attr_dev(path1, "d", "M256.7 160c37.5 0 63.3 20.8 63.3 50.7 0 19.8-9.6 33.5-28.1 44.4-17.4 10.1-23.3 17.5-23.3 30.3v7.9h-34.7l-.3-8.6c-1.7-20.6 5.5-33.4 23.6-44 16.9-10.1 24-16.5 24-28.9s-12-21.5-26.9-21.5c-15.1 0-26 9.8-26.8 24.6H192c.7-32.2 24.5-54.9 64.7-54.9zm-26.3 171.4c0-11.5 9.6-20.6 21.4-20.6 11.9 0 21.5 9 21.5 20.6s-9.6 20.6-21.5 20.6-21.4-9-21.4-20.6z");
    			add_location(path1, file$g, 5, 0, 423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosHelpCircleOutline', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosHelpCircleOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosHelpCircleOutline",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosLogOut.svelte generated by Svelte v3.48.0 */
    const file$f = "node_modules\\svelte-icons\\io\\IoIosLogOut.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$6(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M312 372c-7.7 0-14 6.3-14 14 0 9.9-8.1 18-18 18H94c-9.9 0-18-8.1-18-18V126c0-9.9 8.1-18 18-18h186c9.9 0 18 8.1 18 18 0 7.7 6.3 14 14 14s14-6.3 14-14c0-25.4-20.6-46-46-46H94c-25.4 0-46 20.6-46 46v260c0 25.4 20.6 46 46 46h186c25.4 0 46-20.6 46-46 0-7.7-6.3-14-14-14z");
    			add_location(path0, file$f, 4, 10, 153);
    			attr_dev(path1, "d", "M372.9 158.1c-2.6-2.6-6.1-4.1-9.9-4.1-3.7 0-7.3 1.4-9.9 4.1-5.5 5.5-5.5 14.3 0 19.8l65.2 64.2H162c-7.7 0-14 6.3-14 14s6.3 14 14 14h256.6L355 334.2c-5.4 5.4-5.4 14.3 0 19.8l.1.1c2.7 2.5 6.2 3.9 9.8 3.9 3.8 0 7.3-1.4 9.9-4.1l82.6-82.4c4.3-4.3 6.5-9.3 6.5-14.7 0-5.3-2.3-10.3-6.5-14.5l-84.5-84.2z");
    			add_location(path1, file$f, 5, 0, 431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosLogOut', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosLogOut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosLogOut",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosArrowForward.svelte generated by Svelte v3.48.0 */
    const file$e = "node_modules\\svelte-icons\\io\\IoIosArrowForward.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$5(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z");
    			add_location(path, file$e, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosArrowForward', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosArrowForward extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowForward",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\Components\Menu\MenuItem.svelte generated by Svelte v3.48.0 */

    const file$d = "src\\Components\\Menu\\MenuItem.svelte";

    function create_fragment$d(ctx) {
    	let div3;
    	let div0;
    	let switch_instance;
    	let t0;
    	let div1;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div2;
    	let ioiosarrowforward;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*item*/ ctx[0].icon;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	ioiosarrowforward = new IoIosArrowForward({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			create_component(ioiosarrowforward.$$.fragment);
    			attr_dev(div0, "class", "sidebar-icon svelte-fdbkgc");
    			add_location(div0, file$d, 19, 2, 548);
    			add_location(div1, file$d, 22, 2, 631);
    			attr_dev(div2, "class", "sidebar-arrow svelte-fdbkgc");
    			add_location(div2, file$d, 25, 2, 667);
    			attr_dev(div3, "class", "sidebar-item svelte-fdbkgc");
    			add_location(div3, file$d, 18, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(ioiosarrowforward, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*item*/ ctx[0].icon)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if ((!current || dirty & /*item*/ 1) && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(ioiosarrowforward.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(ioiosarrowforward.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (switch_instance) destroy_component(switch_instance);
    			destroy_component(ioiosarrowforward);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuItem', slots, []);
    	const dispatch = createEventDispatcher();
    	let { item } = $$props;

    	function dispatchClick(endpoint) {
    		if (endpoint === "/signout") {
    			dispatch("signout");
    		} else dispatch("goTo", { endpoint });
    	}

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatchClick(item.endpoint);

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		IoIosArrowForward,
    		createEventDispatcher,
    		dispatch,
    		item,
    		dispatchClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, dispatchClick, click_handler];
    }

    class MenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuItem",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<MenuItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<MenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<MenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Menu\MenuSection.svelte generated by Svelte v3.48.0 */
    const file$c = "src\\Components\\Menu\\MenuSection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each items as item}
    function create_each_block$1(ctx) {
    	let menuitem;
    	let current;

    	menuitem = new MenuItem({
    			props: { item: /*item*/ ctx[4] },
    			$$inline: true
    		});

    	menuitem.$on("goTo", /*goTo_handler*/ ctx[2]);
    	menuitem.$on("signout", /*signout_handler*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(menuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuitem_changes = {};
    			if (dirty & /*items*/ 2) menuitem_changes.item = /*item*/ ctx[4];
    			menuitem.$set(menuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*style*/ ctx[0]) + " svelte-1fom206"));
    			add_location(div, file$c, 7, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 2) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*style*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*style*/ ctx[0]) + " svelte-1fom206"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuSection', slots, []);
    	let { style } = $$props;
    	let { items } = $$props;
    	const writable_props = ['style', 'items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuSection> was created with unknown prop '${key}'`);
    	});

    	function goTo_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function signout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({ MenuItem, style, items });

    	$$self.$inject_state = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [style, items, goTo_handler, signout_handler];
    }

    class MenuSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { style: 0, items: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuSection",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*style*/ ctx[0] === undefined && !('style' in props)) {
    			console.warn("<MenuSection> was created without expected prop 'style'");
    		}

    		if (/*items*/ ctx[1] === undefined && !('items' in props)) {
    			console.warn("<MenuSection> was created without expected prop 'items'");
    		}
    	}

    	get style() {
    		throw new Error("<MenuSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<MenuSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<MenuSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<MenuSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Menu\Menu.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\Components\\Menu\\Menu.svelte";

    // (35:0) {#if show}
    function create_if_block$5(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let tiarrowsortedup;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let t5;
    	let menusection0;
    	let t6;
    	let menusection1;
    	let t7;
    	let menusection2;
    	let current;
    	tiarrowsortedup = new TiArrowSortedUp({ $$inline: true });
    	let if_block = /*mode*/ ctx[3] !== "C" && create_if_block_1$3(ctx);

    	menusection0 = new MenuSection({
    			props: {
    				items: /*menu_items*/ ctx[5],
    				style: "menu-sidebar"
    			},
    			$$inline: true
    		});

    	menusection0.$on("goTo", /*goTo_handler_1*/ ctx[9]);

    	menusection1 = new MenuSection({
    			props: {
    				items: /*help_items*/ ctx[6],
    				style: "help-sidebar"
    			},
    			$$inline: true
    		});

    	menusection1.$on("goTo", /*goTo_handler_2*/ ctx[10]);

    	menusection2 = new MenuSection({
    			props: {
    				items: /*tool_items*/ ctx[7],
    				style: "tool-sidebar"
    			},
    			$$inline: true
    		});

    	menusection2.$on("signout", /*signout_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(tiarrowsortedup.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*name*/ ctx[1]);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(/*email*/ ctx[2]);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			create_component(menusection0.$$.fragment);
    			t6 = space();
    			create_component(menusection1.$$.fragment);
    			t7 = space();
    			create_component(menusection2.$$.fragment);
    			attr_dev(div0, "class", "menu-arrow svelte-q83v1d");
    			add_location(div0, file$b, 42, 6, 1142);
    			attr_dev(div1, "class", "user-sidebar-name");
    			add_location(div1, file$b, 45, 6, 1217);
    			attr_dev(div2, "class", "user-sidebar-email svelte-q83v1d");
    			add_location(div2, file$b, 46, 6, 1268);
    			attr_dev(div3, "class", "user-sidebar svelte-q83v1d");
    			add_location(div3, file$b, 41, 4, 1108);
    			attr_dev(div4, "class", "w3-card-4 menu svelte-q83v1d");
    			toggle_class(div4, "compact", /*mode*/ ctx[3] === "C");
    			toggle_class(div4, "medium", /*mode*/ ctx[3] === "M");
    			toggle_class(div4, "full", /*mode*/ ctx[3] === "F");
    			add_location(div4, file$b, 35, 2, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			mount_component(tiarrowsortedup, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    			if (if_block) if_block.m(div4, null);
    			append_dev(div4, t5);
    			mount_component(menusection0, div4, null);
    			append_dev(div4, t6);
    			mount_component(menusection1, div4, null);
    			append_dev(div4, t7);
    			mount_component(menusection2, div4, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*name*/ 2) set_data_dev(t1, /*name*/ ctx[1]);
    			if (!current || dirty & /*email*/ 4) set_data_dev(t3, /*email*/ ctx[2]);

    			if (/*mode*/ ctx[3] !== "C") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mode*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div4, t5);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*mode*/ 8) {
    				toggle_class(div4, "compact", /*mode*/ ctx[3] === "C");
    			}

    			if (dirty & /*mode*/ 8) {
    				toggle_class(div4, "medium", /*mode*/ ctx[3] === "M");
    			}

    			if (dirty & /*mode*/ 8) {
    				toggle_class(div4, "full", /*mode*/ ctx[3] === "F");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tiarrowsortedup.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(menusection0.$$.fragment, local);
    			transition_in(menusection1.$$.fragment, local);
    			transition_in(menusection2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tiarrowsortedup.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(menusection0.$$.fragment, local);
    			transition_out(menusection1.$$.fragment, local);
    			transition_out(menusection2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(tiarrowsortedup);
    			if (if_block) if_block.d();
    			destroy_component(menusection0);
    			destroy_component(menusection1);
    			destroy_component(menusection2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(35:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (49:4) {#if mode !== "C"}
    function create_if_block_1$3(ctx) {
    	let menusection;
    	let current;

    	menusection = new MenuSection({
    			props: {
    				items: /*navigation_items*/ ctx[0],
    				style: "navigation-sidebar"
    			},
    			$$inline: true
    		});

    	menusection.$on("goTo", /*goTo_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(menusection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menusection, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menusection_changes = {};
    			if (dirty & /*navigation_items*/ 1) menusection_changes.items = /*navigation_items*/ ctx[0];
    			menusection.$set(menusection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menusection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menusection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menusection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(49:4) {#if mode !== \\\"C\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { navigation_items = {} } = $$props;

    	let menu_items = [
    		{
    			name: "Kontoindstillinger",
    			icon: IoIosSettings,
    			endpoint: "/mysettings"
    		}
    	];

    	let help_items = [
    		{
    			name: "Kontakt",
    			icon: TiMessage,
    			endpoint: "/"
    		},
    		{
    			name: "Guide og FAQ",
    			icon: IoIosHelpCircleOutline,
    			endpoint: "/"
    		}
    	];

    	let tool_items = [
    		{
    			name: "Log ud",
    			icon: IoIosLogOut,
    			endpoint: "/signout"
    		}
    	];

    	let { name } = $$props;
    	let { email } = $$props;
    	let { mode } = $$props;
    	let { show } = $$props;
    	const writable_props = ['navigation_items', 'name', 'email', 'mode', 'show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function goTo_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function goTo_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function goTo_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function signout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(0, navigation_items = $$props.navigation_items);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('mode' in $$props) $$invalidate(3, mode = $$props.mode);
    		if ('show' in $$props) $$invalidate(4, show = $$props.show);
    	};

    	$$self.$capture_state = () => ({
    		TiArrowSortedUp,
    		IoIosSettings,
    		TiMessage,
    		IoIosHelpCircleOutline,
    		IoIosLogOut,
    		navigation_items,
    		menu_items,
    		help_items,
    		tool_items,
    		MenuSection,
    		name,
    		email,
    		mode,
    		show
    	});

    	$$self.$inject_state = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(0, navigation_items = $$props.navigation_items);
    		if ('menu_items' in $$props) $$invalidate(5, menu_items = $$props.menu_items);
    		if ('help_items' in $$props) $$invalidate(6, help_items = $$props.help_items);
    		if ('tool_items' in $$props) $$invalidate(7, tool_items = $$props.tool_items);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('mode' in $$props) $$invalidate(3, mode = $$props.mode);
    		if ('show' in $$props) $$invalidate(4, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		navigation_items,
    		name,
    		email,
    		mode,
    		show,
    		menu_items,
    		help_items,
    		tool_items,
    		goTo_handler,
    		goTo_handler_1,
    		goTo_handler_2,
    		signout_handler
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			navigation_items: 0,
    			name: 1,
    			email: 2,
    			mode: 3,
    			show: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !('name' in props)) {
    			console.warn("<Menu> was created without expected prop 'name'");
    		}

    		if (/*email*/ ctx[2] === undefined && !('email' in props)) {
    			console.warn("<Menu> was created without expected prop 'email'");
    		}

    		if (/*mode*/ ctx[3] === undefined && !('mode' in props)) {
    			console.warn("<Menu> was created without expected prop 'mode'");
    		}

    		if (/*show*/ ctx[4] === undefined && !('show' in props)) {
    			console.warn("<Menu> was created without expected prop 'show'");
    		}
    	}

    	get navigation_items() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigation_items(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\io\IoIosArrowDown.svelte generated by Svelte v3.48.0 */
    const file$a = "node_modules\\svelte-icons\\io\\IoIosArrowDown.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z");
    			add_location(path, file$a, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosArrowDown', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosArrowDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowDown",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosArrowUp.svelte generated by Svelte v3.48.0 */
    const file$9 = "node_modules\\svelte-icons\\io\\IoIosArrowUp.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z");
    			add_location(path, file$9, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosArrowUp', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosArrowUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowUp",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules\svelte-icons\fa\FaUserCircle.svelte generated by Svelte v3.48.0 */
    const file$8 = "node_modules\\svelte-icons\\fa\\FaUserCircle.svelte";

    // (4:8) <IconBase viewBox="0 0 496 512" {...$$props}>
    function create_default_slot$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z");
    			add_location(path, file$8, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 496 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 496 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaUserCircle', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaUserCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaUserCircle",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiThMenu.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules\\svelte-icons\\ti\\TiThMenu.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 17h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2zM19 10h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2zM19 3h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2z");
    			add_location(path, file$7, 4, 10, 151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiThMenu', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class TiThMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiThMenu",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Components\Menu\MyAccount.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\Components\\Menu\\MyAccount.svelte";

    // (24:2) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let tithmenu;
    	let current;
    	tithmenu = new TiThMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tithmenu.$$.fragment);
    			attr_dev(div, "class", "menu-icon svelte-1e442y3");
    			add_location(div, file$6, 24, 4, 695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tithmenu, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tithmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tithmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tithmenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(24:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:2) {#if menu_mode === "C"}
    function create_if_block$4(ctx) {
    	let div1;
    	let div0;
    	let fausercircle;
    	let t0;
    	let span0;
    	let t2;
    	let span1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	fausercircle = new FaUserCircle({ $$inline: true });
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*show*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fausercircle.$$.fragment);
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Min Konto";
    			t2 = space();
    			span1 = element("span");
    			if_block.c();
    			attr_dev(div0, "class", "sidebar-icon svelte-1e442y3");
    			add_location(div0, file$6, 13, 6, 435);
    			add_location(span0, file$6, 14, 6, 491);
    			attr_dev(span1, "class", "arrow svelte-1e442y3");
    			add_location(span1, file$6, 15, 6, 521);
    			attr_dev(div1, "class", "myAccount svelte-1e442y3");
    			add_location(div1, file$6, 12, 4, 404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(fausercircle, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			if_blocks[current_block_type_index].m(span1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(span1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fausercircle.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fausercircle.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(fausercircle);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(12:2) {#if menu_mode === \\\"C\\\"}",
    		ctx
    	});

    	return block;
    }

    // (19:8) {:else}
    function create_else_block$2(ctx) {
    	let ioiosarrowdown;
    	let current;
    	ioiosarrowdown = new IoIosArrowDown({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ioiosarrowdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ioiosarrowdown, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiosarrowdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiosarrowdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ioiosarrowdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(19:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:8) {#if show}
    function create_if_block_1$2(ctx) {
    	let ioiosarrowup;
    	let current;
    	ioiosarrowup = new IoIosArrowUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ioiosarrowup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ioiosarrowup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiosarrowup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiosarrowup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ioiosarrowup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(17:8) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$4, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*menu_mode*/ ctx[1] === "C") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$6, 10, 0, 334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyAccount', slots, []);
    	let { show } = $$props;
    	let { menu_mode } = $$props;
    	const writable_props = ['show', 'menu_mode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyAccount> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, show = !show);

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('menu_mode' in $$props) $$invalidate(1, menu_mode = $$props.menu_mode);
    	};

    	$$self.$capture_state = () => ({
    		IoIosArrowDown,
    		IoIosArrowUp,
    		FaUserCircle,
    		TiThMenu,
    		show,
    		menu_mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('menu_mode' in $$props) $$invalidate(1, menu_mode = $$props.menu_mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, menu_mode, click_handler];
    }

    class MyAccount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { show: 0, menu_mode: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyAccount",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*show*/ ctx[0] === undefined && !('show' in props)) {
    			console.warn("<MyAccount> was created without expected prop 'show'");
    		}

    		if (/*menu_mode*/ ctx[1] === undefined && !('menu_mode' in props)) {
    			console.warn("<MyAccount> was created without expected prop 'menu_mode'");
    		}
    	}

    	get show() {
    		throw new Error("<MyAccount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<MyAccount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menu_mode() {
    		throw new Error("<MyAccount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu_mode(value) {
    		throw new Error("<MyAccount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Menu\MenuLinks.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\Components\\Menu\\MenuLinks.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (10:2) {#each navigation_items as item}
    function create_each_block(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[3].name + "";
    	let t;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*item*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[3].endpoint);
    			attr_dev(a, "class", "link svelte-xbp9ud");
    			toggle_class(a, "current", /*page*/ ctx[0] === /*item*/ ctx[3].endpoint);
    			add_location(a, file$5, 10, 4, 243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a)),
    					listen_dev(a, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*navigation_items*/ 2 && t_value !== (t_value = /*item*/ ctx[3].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*navigation_items*/ 2 && a_href_value !== (a_href_value = /*item*/ ctx[3].endpoint)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*page, navigation_items*/ 3) {
    				toggle_class(a, "current", /*page*/ ctx[0] === /*item*/ ctx[3].endpoint);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:2) {#each navigation_items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let div_intro;
    	let each_value = /*navigation_items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "link-container svelte-xbp9ud");
    			add_location(div, file$5, 8, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navigation_items, page*/ 3) {
    				each_value = /*navigation_items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuLinks', slots, []);
    	let { navigation_items } = $$props;
    	let { page } = $$props;
    	const writable_props = ['navigation_items', 'page'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuLinks> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => $$invalidate(0, page = item.endpoint);

    	$$self.$$set = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(1, navigation_items = $$props.navigation_items);
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    	};

    	$$self.$capture_state = () => ({ link, fade, navigation_items, page });

    	$$self.$inject_state = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(1, navigation_items = $$props.navigation_items);
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, navigation_items, click_handler];
    }

    class MenuLinks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { navigation_items: 1, page: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuLinks",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*navigation_items*/ ctx[1] === undefined && !('navigation_items' in props)) {
    			console.warn("<MenuLinks> was created without expected prop 'navigation_items'");
    		}

    		if (/*page*/ ctx[0] === undefined && !('page' in props)) {
    			console.warn("<MenuLinks> was created without expected prop 'page'");
    		}
    	}

    	get navigation_items() {
    		throw new Error("<MenuLinks>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigation_items(value) {
    		throw new Error("<MenuLinks>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<MenuLinks>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<MenuLinks>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\NavBar.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\Components\\NavBar.svelte";

    // (81:2) {#if menu_mode === "C"}
    function create_if_block_1$1(ctx) {
    	let div;
    	let menulinks;
    	let updating_page;
    	let current;

    	function menulinks_page_binding(value) {
    		/*menulinks_page_binding*/ ctx[10](value);
    	}

    	let menulinks_props = {
    		navigation_items: /*navigation_items*/ ctx[3]
    	};

    	if (/*$page*/ ctx[1] !== void 0) {
    		menulinks_props.page = /*$page*/ ctx[1];
    	}

    	menulinks = new MenuLinks({ props: menulinks_props, $$inline: true });
    	binding_callbacks.push(() => bind(menulinks, 'page', menulinks_page_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menulinks.$$.fragment);
    			attr_dev(div, "class", "links");
    			add_location(div, file$4, 81, 4, 2207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menulinks, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menulinks_changes = {};
    			if (dirty & /*navigation_items*/ 8) menulinks_changes.navigation_items = /*navigation_items*/ ctx[3];

    			if (!updating_page && dirty & /*$page*/ 2) {
    				updating_page = true;
    				menulinks_changes.page = /*$page*/ ctx[1];
    				add_flush_callback(() => updating_page = false);
    			}

    			menulinks.$set(menulinks_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menulinks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menulinks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(menulinks);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(81:2) {#if menu_mode === \\\"C\\\"}",
    		ctx
    	});

    	return block;
    }

    // (91:2) {#if show && menu_mode !== "C"}
    function create_if_block$3(ctx) {
    	let div;
    	let ioiosclose;
    	let current;
    	let mounted;
    	let dispose;
    	ioiosclose = new IoIosClose({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(ioiosclose.$$.fragment);
    			attr_dev(div, "class", "menu-close svelte-1cjfsd0");
    			add_location(div, file$4, 91, 4, 2450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(ioiosclose, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiosclose.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiosclose.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(ioiosclose);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(91:2) {#if show && menu_mode !== \\\"C\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let div0;
    	let logo;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let myaccount;
    	let updating_show;
    	let t4;
    	let menu;
    	let updating_mode;
    	let updating_show_1;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[9]);
    	logo = new Logo({ props: { size: "M" }, $$inline: true });
    	let if_block0 = /*menu_mode*/ ctx[4] === "C" && create_if_block_1$1(ctx);
    	let if_block1 = /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== "C" && create_if_block$3(ctx);

    	function myaccount_show_binding(value) {
    		/*myaccount_show_binding*/ ctx[12](value);
    	}

    	let myaccount_props = { menu_mode: /*menu_mode*/ ctx[4] };

    	if (/*show*/ ctx[2] !== void 0) {
    		myaccount_props.show = /*show*/ ctx[2];
    	}

    	myaccount = new MyAccount({ props: myaccount_props, $$inline: true });
    	binding_callbacks.push(() => bind(myaccount, 'show', myaccount_show_binding));

    	function menu_mode_binding(value) {
    		/*menu_mode_binding*/ ctx[13](value);
    	}

    	function menu_show_binding(value) {
    		/*menu_show_binding*/ ctx[14](value);
    	}

    	let menu_props = {
    		navigation_items: /*navigation_items*/ ctx[3],
    		name: /*name*/ ctx[5],
    		email: /*email*/ ctx[6]
    	};

    	if (/*menu_mode*/ ctx[4] !== void 0) {
    		menu_props.mode = /*menu_mode*/ ctx[4];
    	}

    	if (/*show*/ ctx[2] !== void 0) {
    		menu_props.show = /*show*/ ctx[2];
    	}

    	menu = new Menu({ props: menu_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu, 'mode', menu_mode_binding));
    	binding_callbacks.push(() => bind(menu, 'show', menu_show_binding));
    	menu.$on("goTo", /*goTo*/ ctx[7]);
    	menu.$on("goTo", /*goTo_handler*/ ctx[15]);
    	menu.$on("signout", /*signout_handler*/ ctx[16]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			create_component(myaccount.$$.fragment);
    			t4 = space();
    			create_component(menu.$$.fragment);
    			attr_dev(div0, "class", "logo-container svelte-1cjfsd0");
    			add_location(div0, file$4, 75, 2, 2091);
    			attr_dev(div1, "class", "svelte-1cjfsd0");
    			toggle_class(div1, "overlay", /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== "C");
    			add_location(div1, file$4, 87, 2, 2341);
    			attr_dev(div2, "class", "menu svelte-1cjfsd0");
    			add_location(div2, file$4, 94, 2, 2541);
    			attr_dev(div3, "class", "nav svelte-1cjfsd0");
    			add_location(div3, file$4, 73, 0, 2053);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(logo, div0, null);
    			append_dev(div3, t0);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(myaccount, div2, null);
    			append_dev(div2, t4);
    			mount_component(menu, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menu_mode*/ ctx[4] === "C") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*menu_mode*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*show, menu_mode*/ 20) {
    				toggle_class(div1, "overlay", /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== "C");
    			}

    			if (/*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== "C") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*show, menu_mode*/ 20) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const myaccount_changes = {};
    			if (dirty & /*menu_mode*/ 16) myaccount_changes.menu_mode = /*menu_mode*/ ctx[4];

    			if (!updating_show && dirty & /*show*/ 4) {
    				updating_show = true;
    				myaccount_changes.show = /*show*/ ctx[2];
    				add_flush_callback(() => updating_show = false);
    			}

    			myaccount.$set(myaccount_changes);
    			const menu_changes = {};
    			if (dirty & /*navigation_items*/ 8) menu_changes.navigation_items = /*navigation_items*/ ctx[3];

    			if (!updating_mode && dirty & /*menu_mode*/ 16) {
    				updating_mode = true;
    				menu_changes.mode = /*menu_mode*/ ctx[4];
    				add_flush_callback(() => updating_mode = false);
    			}

    			if (!updating_show_1 && dirty & /*show*/ 4) {
    				updating_show_1 = true;
    				menu_changes.show = /*show*/ ctx[2];
    				add_flush_callback(() => updating_show_1 = false);
    			}

    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(myaccount.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(myaccount.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(logo);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(myaccount);
    			destroy_component(menu);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let menu_mode;
    	let $page;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	let { isAdmin } = $$props;
    	let name = "Ali Chouikhi";
    	let email = "samirali@live.dk";
    	let show = false;

    	//array with available links
    	let navigation_items = [
    		{
    			name: "Oversigt",
    			icon: TiHomeOutline,
    			endpoint: "/"
    		},
    		{
    			name: "Vagtplan",
    			icon: MdSchedule,
    			endpoint: "/schedule"
    		},
    		{
    			name: "Beskeder",
    			icon: IoIosChatboxes,
    			endpoint: "/messages"
    		}
    	];

    	onMount(() => {
    		if (isAdmin) {
    			$$invalidate(3, navigation_items = [
    				...navigation_items,
    				{
    					name: "Medarbejder",
    					icon: IoIosPeople,
    					endpoint: "/employees"
    				}
    			]);
    		}
    	});

    	let screenWidth;

    	function goTo(e) {
    		$$invalidate(2, show = false);
    	} // $page = e.detail.endpoint;
    	// navigate($page);

    	const writable_props = ['isAdmin'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	}

    	function menulinks_page_binding(value) {
    		$page = value;
    		page.set($page);
    	}

    	const click_handler = () => $$invalidate(2, show = false);

    	function myaccount_show_binding(value) {
    		show = value;
    		$$invalidate(2, show);
    	}

    	function menu_mode_binding(value) {
    		menu_mode = value;
    		($$invalidate(4, menu_mode), $$invalidate(0, screenWidth));
    	}

    	function menu_show_binding(value) {
    		show = value;
    		$$invalidate(2, show);
    	}

    	function goTo_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function signout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(8, isAdmin = $$props.isAdmin);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		link,
    		navigate,
    		fade,
    		slide,
    		fly,
    		scale,
    		page,
    		Logo,
    		isAdmin,
    		TiHomeOutline,
    		MdSchedule,
    		IoIosChatboxes,
    		IoIosClose,
    		IoIosPeople,
    		Menu,
    		MyAccount,
    		MenuLinks,
    		onMount,
    		name,
    		email,
    		show,
    		navigation_items,
    		screenWidth,
    		goTo,
    		menu_mode,
    		$page
    	});

    	$$self.$inject_state = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(8, isAdmin = $$props.isAdmin);
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('email' in $$props) $$invalidate(6, email = $$props.email);
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    		if ('navigation_items' in $$props) $$invalidate(3, navigation_items = $$props.navigation_items);
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('menu_mode' in $$props) $$invalidate(4, menu_mode = $$props.menu_mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$page*/ 2) {
    			// update the sessionStorage each time the page state changes
    			sessionStorage.setItem("lastVisited", $page);
    		}

    		if ($$self.$$.dirty & /*screenWidth*/ 1) {
    			//compact, medium, full
    			$$invalidate(4, menu_mode = screenWidth > 1100 ? "C" : screenWidth > 760 ? "M" : "F");
    		}
    	};

    	return [
    		screenWidth,
    		$page,
    		show,
    		navigation_items,
    		menu_mode,
    		name,
    		email,
    		goTo,
    		isAdmin,
    		onwindowresize,
    		menulinks_page_binding,
    		click_handler,
    		myaccount_show_binding,
    		menu_mode_binding,
    		menu_show_binding,
    		goTo_handler,
    		signout_handler
    	];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { isAdmin: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isAdmin*/ ctx[8] === undefined && !('isAdmin' in props)) {
    			console.warn("<NavBar> was created without expected prop 'isAdmin'");
    		}
    	}

    	get isAdmin() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAdmin(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\Components\\Footer.svelte";

    function create_fragment$3(ctx) {
    	let footer;
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let logo;
    	let current;
    	logo = new Logo({ props: { size: "S" }, $$inline: true });

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Copyright © 2022";
    			t1 = space();
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			add_location(p, file$3, 6, 4, 128);
    			add_location(div0, file$3, 8, 4, 164);
    			attr_dev(div1, "class", "footer-container w3-padding svelte-1hps5az");
    			add_location(div1, file$3, 5, 2, 81);
    			attr_dev(footer, "class", " svelte-1hps5az");
    			add_location(footer, file$3, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, p);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(logo, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(logo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Layouts\Private.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;

    const file$2 = "src\\Layouts\\Private.svelte";

    // (53:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(53:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if $isLoading}
    function create_if_block$2(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: {
    				styles: {
    					outer: /*$primary_color*/ ctx[1],
    					center: /*$secondary_color*/ ctx[0]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loader_changes = {};

    			if (dirty & /*$primary_color, $secondary_color*/ 3) loader_changes.styles = {
    				outer: /*$primary_color*/ ctx[1],
    				center: /*$secondary_color*/ ctx[0]
    			};

    			loader.$set(loader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(51:4) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let navbar;
    	let t0;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;

    	navbar = new NavBar({
    			props: { isAdmin: /*$isAdmin*/ ctx[3] },
    			$$inline: true
    		});

    	navbar.$on("signout", /*signout*/ ctx[5]);
    	navbar.$on("goTo", /*goTo*/ ctx[6]);
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLoading*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			if_block.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "main svelte-s9901n");
    			add_location(div0, file$2, 49, 2, 1220);
    			attr_dev(div1, "style", /*cssVarStyles*/ ctx[2]);
    			add_location(div1, file$2, 47, 0, 1121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(navbar, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t1);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};
    			if (dirty & /*$isAdmin*/ 8) navbar_changes.isAdmin = /*$isAdmin*/ ctx[3];
    			navbar.$set(navbar_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}

    			if (!current || dirty & /*cssVarStyles*/ 4) {
    				attr_dev(div1, "style", /*cssVarStyles*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(navbar);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let styles;
    	let cssVarStyles;
    	let $page;
    	let $user;
    	let $text_color;
    	let $secondary_color;
    	let $primary_color;
    	let $isAdmin;
    	let $isLoading;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(11, $page = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(12, $user = $$value));
    	validate_store(text_color, 'text_color');
    	component_subscribe($$self, text_color, $$value => $$invalidate(8, $text_color = $$value));
    	validate_store(secondary_color, 'secondary_color');
    	component_subscribe($$self, secondary_color, $$value => $$invalidate(0, $secondary_color = $$value));
    	validate_store(primary_color, 'primary_color');
    	component_subscribe($$self, primary_color, $$value => $$invalidate(1, $primary_color = $$value));
    	validate_store(isAdmin, 'isAdmin');
    	component_subscribe($$self, isAdmin, $$value => $$invalidate(3, $isAdmin = $$value));
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(4, $isLoading = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Private', slots, ['default']);

    	async function signout() {
    		const response = await fetch("/signout", { method: "DELETE" });

    		//201 Ok
    		if (response.status === 201) {
    			//reset the page state,
    			//to not get an access denied or papge not found error
    			set_store_value(page, $page = "/", $page);

    			set_store_value(user, $user = {}, $user);
    		}
    	}

    	function goTo(e) {
    		set_store_value(page, $page = e.detail.endpoint, $page);
    		navigate($page);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Private> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		NavBar,
    		Footer,
    		Loader,
    		isAdmin,
    		user,
    		page,
    		navigate,
    		primary_color,
    		secondary_color,
    		text_color,
    		isLoading,
    		signout,
    		goTo,
    		styles,
    		cssVarStyles,
    		$page,
    		$user,
    		$text_color,
    		$secondary_color,
    		$primary_color,
    		$isAdmin,
    		$isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(7, styles = $$props.styles);
    		if ('cssVarStyles' in $$props) $$invalidate(2, cssVarStyles = $$props.cssVarStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$primary_color, $secondary_color, $text_color*/ 259) {
    			$$invalidate(7, styles = {
    				"primary-color": $primary_color,
    				"secondary-color": $secondary_color,
    				"text-color": $text_color,
    				font: '"Gluten", cursive'
    			});
    		}

    		if ($$self.$$.dirty & /*styles*/ 128) {
    			$$invalidate(2, cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(";"));
    		}
    	};

    	return [
    		$secondary_color,
    		$primary_color,
    		cssVarStyles,
    		$isAdmin,
    		$isLoading,
    		signout,
    		goTo,
    		styles,
    		$text_color,
    		$$scope,
    		slots
    	];
    }

    class Private extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Private",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\CommingSoon.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\CommingSoon.svelte";

    // (34:4) {#if info}
    function create_if_block$1(ctx) {
    	let div3;
    	let div0;
    	let b0;
    	let t1;
    	let ul0;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let li2;
    	let t7;
    	let li3;
    	let t9;
    	let li4;
    	let t11;
    	let li5;
    	let t13;
    	let li6;
    	let t15;
    	let div1;
    	let b1;
    	let t17;
    	let ul1;
    	let li7;
    	let t19;
    	let li8;
    	let t21;
    	let li9;
    	let t23;
    	let li10;
    	let t25;
    	let div2;
    	let b2;
    	let t27;
    	let ul2;
    	let li11;
    	let t29;
    	let li12;
    	let t31;
    	let li13;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			b0 = element("b");
    			b0.textContent = "For dig der er leder";
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Du får kontrol og overblik over dine ansatte og deres vagter";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Du får detaljeret overblik over dine ansattes timer, mødetid,\r\n              forsinkelser, ferier og meget mere";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Opret teams og uddel tasks/assignments";
    			t7 = space();
    			li3 = element("li");
    			li3.textContent = "kræv at dine ansatte checker ind og ud af vagten";
    			t9 = space();
    			li4 = element("li");
    			li4.textContent = "Afsæt timeløn, så dine ansatte kan følge med i deres forventet\r\n              indkomst";
    			t11 = space();
    			li5 = element("li");
    			li5.textContent = "Udmelde til alle dine ansatte eller bestemte";
    			t13 = space();
    			li6 = element("li");
    			li6.textContent = "fordel stillinger til dine ansatte";
    			t15 = space();
    			div1 = element("div");
    			b1 = element("b");
    			b1.textContent = "For dig der er ansat";
    			t17 = space();
    			ul1 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Du får kontrol og overblik over dine vagter";
    			t19 = space();
    			li8 = element("li");
    			li8.textContent = "Søg ferie/fri dag/sygdag og mere gennem appen";
    			t21 = space();
    			li9 = element("li");
    			li9.textContent = "Byt vagter med dine kollegaer";
    			t23 = space();
    			li10 = element("li");
    			li10.textContent = "Anmod om flere vagter eller færre";
    			t25 = space();
    			div2 = element("div");
    			b2 = element("b");
    			b2.textContent = "For Alle";
    			t27 = space();
    			ul2 = element("ul");
    			li11 = element("li");
    			li11.textContent = "Din data er sikker hos os, vi vidergiver ikke data til tredjepart";
    			t29 = space();
    			li12 = element("li");
    			li12.textContent = "Du behøver ikke at nøjes med vores Original Tema, du kan vælge fra\r\n              et divers udvalg";
    			t31 = space();
    			li13 = element("li");
    			li13.textContent = "Vores mål er at gøre vores produkt til et brugervenligt produkt,\r\n              dvs. at du skal kunne tage kontrol over alt hvad du gerne vil tage\r\n              kontrol over";
    			add_location(b0, file$1, 38, 10, 1043);
    			add_location(li0, file$1, 40, 12, 1100);
    			add_location(li1, file$1, 43, 12, 1213);
    			add_location(li2, file$1, 47, 12, 1377);
    			add_location(li3, file$1, 48, 12, 1438);
    			add_location(li4, file$1, 49, 12, 1509);
    			add_location(li5, file$1, 53, 12, 1648);
    			add_location(li6, file$1, 54, 12, 1715);
    			attr_dev(ul0, "class", "svelte-zc9yqs");
    			add_location(ul0, file$1, 39, 10, 1082);
    			attr_dev(div0, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div0, file$1, 35, 8, 905);
    			add_location(b1, file$1, 60, 10, 1939);
    			add_location(li7, file$1, 62, 12, 1996);
    			add_location(li8, file$1, 63, 12, 2062);
    			add_location(li9, file$1, 64, 12, 2130);
    			add_location(li10, file$1, 65, 12, 2182);
    			attr_dev(ul1, "class", "svelte-zc9yqs");
    			add_location(ul1, file$1, 61, 10, 1978);
    			attr_dev(div1, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div1, file$1, 57, 8, 1801);
    			add_location(b2, file$1, 71, 10, 2405);
    			add_location(li11, file$1, 73, 12, 2450);
    			add_location(li12, file$1, 76, 12, 2568);
    			add_location(li13, file$1, 80, 12, 2719);
    			attr_dev(ul2, "class", "svelte-zc9yqs");
    			add_location(ul2, file$1, 72, 10, 2432);
    			attr_dev(div2, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div2, file$1, 68, 8, 2267);
    			attr_dev(div3, "class", "container content-container svelte-zc9yqs");
    			add_location(div3, file$1, 34, 6, 854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, b0);
    			append_dev(div0, t1);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			append_dev(ul0, t5);
    			append_dev(ul0, li2);
    			append_dev(ul0, t7);
    			append_dev(ul0, li3);
    			append_dev(ul0, t9);
    			append_dev(ul0, li4);
    			append_dev(ul0, t11);
    			append_dev(ul0, li5);
    			append_dev(ul0, t13);
    			append_dev(ul0, li6);
    			append_dev(div3, t15);
    			append_dev(div3, div1);
    			append_dev(div1, b1);
    			append_dev(div1, t17);
    			append_dev(div1, ul1);
    			append_dev(ul1, li7);
    			append_dev(ul1, t19);
    			append_dev(ul1, li8);
    			append_dev(ul1, t21);
    			append_dev(ul1, li9);
    			append_dev(ul1, t23);
    			append_dev(ul1, li10);
    			append_dev(div3, t25);
    			append_dev(div3, div2);
    			append_dev(div2, b2);
    			append_dev(div2, t27);
    			append_dev(div2, ul2);
    			append_dev(ul2, li11);
    			append_dev(ul2, t29);
    			append_dev(ul2, li12);
    			append_dev(ul2, t31);
    			append_dev(ul2, li13);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(34:4) {#if info}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let div3;
    	let div0;
    	let logo;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let b0;
    	let t4;
    	let div2;
    	let p0;
    	let t5;
    	let b1;
    	let t7;
    	let t8;
    	let div4;
    	let p1;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	logo = new Logo({ props: { size: "L" }, $$inline: true });
    	let if_block = /*info*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Vi kommer snart!";
    			t2 = space();
    			div1 = element("div");
    			b0 = element("b");
    			b0.textContent = "Hvis alt går vel, er vi ude sommer 2023";
    			t4 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t5 = text("Snart kommer vi ud med ");
    			b1 = element("b");
    			b1.textContent = "Weeki";
    			t7 = text(", et management system for all typer\r\n        virksomheder og størrelser.");
    			t8 = space();
    			div4 = element("div");
    			p1 = element("p");
    			p1.textContent = "Se hvad Vi kan gøre for dig";
    			t10 = space();
    			if (if_block) if_block.c();
    			add_location(div0, file$1, 9, 4, 232);
    			add_location(h1, file$1, 12, 4, 282);
    			add_location(b0, file$1, 14, 6, 355);
    			attr_dev(div1, "class", "w3-center w3-section");
    			add_location(div1, file$1, 13, 4, 313);
    			add_location(b1, file$1, 18, 31, 508);
    			attr_dev(p0, "class", "svelte-zc9yqs");
    			add_location(p0, file$1, 17, 6, 472);
    			attr_dev(div2, "class", "content w3-container w3-center svelte-zc9yqs");
    			add_location(div2, file$1, 16, 4, 419);
    			attr_dev(div3, "class", "container w3-container w3-border svelte-zc9yqs");
    			attr_dev(div3, "style", /*styles*/ ctx[1]);
    			add_location(div3, file$1, 8, 2, 165);
    			attr_dev(p1, "class", "w3-button w3-hover-blue svelte-zc9yqs");
    			add_location(p1, file$1, 24, 4, 661);
    			attr_dev(div4, "class", "container svelte-zc9yqs");
    			add_location(div4, file$1, 23, 2, 632);
    			attr_dev(div5, "class", "main svelte-zc9yqs");
    			add_location(div5, file$1, 7, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			mount_component(logo, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, b0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t5);
    			append_dev(p0, b1);
    			append_dev(p0, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, p1);
    			append_dev(div4, t10);
    			if (if_block) if_block.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*info*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(logo);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommingSoon', slots, []);
    	const styles = `--secondary-color: #0088ff;`;
    	let info = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CommingSoon> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, info = !info);
    		y = 250;
    	};

    	$$self.$capture_state = () => ({ Logo, styles, info });

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [info, styles, click_handler];
    }

    class CommingSoon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommingSoon",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (81:0) {:else}
    function create_else_block(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $loggedIn*/ 40) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(81:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (79:27) 
    function create_if_block_1(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: {
    				styles: {
    					outer: /*$primary_color*/ ctx[1],
    					center: /*$secondary_color*/ ctx[2]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loader_changes = {};

    			if (dirty & /*$primary_color, $secondary_color*/ 6) loader_changes.styles = {
    				outer: /*$primary_color*/ ctx[1],
    				center: /*$secondary_color*/ ctx[2]
    			};

    			loader.$set(loader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(79:27) ",
    		ctx
    	});

    	return block;
    }

    // (77:0) {#if development}
    function create_if_block(ctx) {
    	let commingsoon;
    	let current;
    	commingsoon = new CommingSoon({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(commingsoon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(commingsoon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(commingsoon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(commingsoon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(commingsoon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(77:0) {#if development}",
    		ctx
    	});

    	return block;
    }

    // (96:4) {:else}
    function create_else_block_1(ctx) {
    	let public_1;
    	let current;

    	public_1 = new Public({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(public_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(public_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const public_1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				public_1_changes.$$scope = { dirty, ctx };
    			}

    			public_1.$set(public_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(public_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(public_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(public_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(96:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#if $loggedIn}
    function create_if_block_2(ctx) {
    	let main;
    	let private_1;
    	let current;

    	private_1 = new Private({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(private_1.$$.fragment);
    			attr_dev(main, "class", "svelte-5li0bo");
    			add_location(main, file, 83, 6, 2776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(private_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const private_1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				private_1_changes.$$scope = { dirty, ctx };
    			}

    			private_1.$set(private_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(private_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(private_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(private_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(83:4) {#if $loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (98:8) <Route path="/">
    function create_default_slot_6(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(98:8) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (101:8) <Route path="/signup">
    function create_default_slot_5(ctx) {
    	let signup;
    	let current;
    	signup = new Signup({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(101:8) <Route path=\\\"/signup\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:8) <Route>
    function create_default_slot_4(ctx) {
    	let div;
    	let notfound;
    	let current;
    	notfound = new NotFound({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(notfound.$$.fragment);
    			add_location(div, file, 104, 10, 3430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(notfound, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notfound.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notfound.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(notfound);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(104:8) <Route>",
    		ctx
    	});

    	return block;
    }

    // (97:6) <Public>
    function create_default_slot_3(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/signup",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(97:6) <Public>",
    		ctx
    	});

    	return block;
    }

    // (91:10) <Route>
    function create_default_slot_2(ctx) {
    	let notfound;
    	let current;
    	notfound = new NotFound({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(notfound.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notfound, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notfound.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notfound.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notfound, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(91:10) <Route>",
    		ctx
    	});

    	return block;
    }

    // (85:8) <Private>
    function create_default_slot_1(ctx) {
    	let protectedroute0;
    	let t0;
    	let protectedroute1;
    	let t1;
    	let protectedroute2;
    	let t2;
    	let protectedroute3;
    	let t3;
    	let protectedroute4;
    	let t4;
    	let route;
    	let current;

    	protectedroute0 = new ProtectedRoute({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	protectedroute1 = new ProtectedRoute({
    			props: { path: "/schedule", component: Schedule },
    			$$inline: true
    		});

    	protectedroute2 = new ProtectedRoute({
    			props: { path: "/messages", component: Messages },
    			$$inline: true
    		});

    	protectedroute3 = new ProtectedRoute({
    			props: { path: "/employees", component: Employees },
    			$$inline: true
    		});

    	protectedroute4 = new ProtectedRoute({
    			props: {
    				path: "/mysettings",
    				component: MySettings
    			},
    			$$inline: true
    		});

    	route = new Route({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(protectedroute0.$$.fragment);
    			t0 = space();
    			create_component(protectedroute1.$$.fragment);
    			t1 = space();
    			create_component(protectedroute2.$$.fragment);
    			t2 = space();
    			create_component(protectedroute3.$$.fragment);
    			t3 = space();
    			create_component(protectedroute4.$$.fragment);
    			t4 = space();
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(protectedroute0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(protectedroute1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(protectedroute2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(protectedroute3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(protectedroute4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(protectedroute0.$$.fragment, local);
    			transition_in(protectedroute1.$$.fragment, local);
    			transition_in(protectedroute2.$$.fragment, local);
    			transition_in(protectedroute3.$$.fragment, local);
    			transition_in(protectedroute4.$$.fragment, local);
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(protectedroute0.$$.fragment, local);
    			transition_out(protectedroute1.$$.fragment, local);
    			transition_out(protectedroute2.$$.fragment, local);
    			transition_out(protectedroute3.$$.fragment, local);
    			transition_out(protectedroute4.$$.fragment, local);
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(protectedroute0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(protectedroute1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(protectedroute2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(protectedroute3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(protectedroute4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(85:8) <Private>",
    		ctx
    	});

    	return block;
    }

    // (82:2) <Router>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$loggedIn*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(82:2) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*development*/ ctx[4]) return 0;
    		if (/*state*/ ctx[0] === "init") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $primary_color;
    	let $secondary_color;
    	let $loggedIn;
    	validate_store(primary_color, 'primary_color');
    	component_subscribe($$self, primary_color, $$value => $$invalidate(1, $primary_color = $$value));
    	validate_store(secondary_color, 'secondary_color');
    	component_subscribe($$self, secondary_color, $$value => $$invalidate(2, $secondary_color = $$value));
    	validate_store(loggedIn, 'loggedIn');
    	component_subscribe($$self, loggedIn, $$value => $$invalidate(3, $loggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let state = "init";

    	onMount(async () => {
    		//$user = { name: "ali", email: "samirali@live.dk" };
    		/**
     * auth needs to be done here, and on Mount
     * that is, to early on define whether the user is authorized to access the private pages
     * this will all happen, while the user is seeing the loader
     * so even if the first landing page is the login,
     * and the user is authenticated and gets access to Home
     * and the routes hopes from login to Home, it will all be hidden from the user
     * and the user will only see the screen he is suppose to
     */
    		// const respons = await fetch("/api/auth");
    		// const data = await respons.json();
    		// if (respons.status !== 403) {
    		//   $user = data;
    		//   navigate($page);
    		// } else {
    		//   navigate("/");
    		// }
    		// navigate($page);
    		$$invalidate(0, state = "ready");
    	});

    	let development = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		navigate,
    		ProtectedRoute,
    		Login,
    		Signup,
    		Home,
    		Schedule,
    		Messages,
    		Employees,
    		MySettings,
    		NotFound,
    		Loader,
    		Public,
    		Private,
    		onMount,
    		page,
    		primary_color,
    		secondary_color,
    		loggedIn,
    		user,
    		CommingSoon,
    		state,
    		development,
    		$primary_color,
    		$secondary_color,
    		$loggedIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('development' in $$props) $$invalidate(4, development = $$props.development);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, $primary_color, $secondary_color, $loggedIn, development];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
