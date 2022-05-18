
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

    function create_fragment$u(ctx) {
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$u.name
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
    function create_if_block$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$4];
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$4(ctx) {
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$5(ctx) {
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$b(ctx);

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
    					if_block = create_if_block$b(ctx);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$t.name
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
    const file$r = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$s(ctx) {
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
    			add_location(a, file$r, 40, 0, 1249);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$s.name
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
    function create_if_block$a(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: /*path*/ ctx[0],
    				$$slots: { default: [create_default_slot$6] },
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(11:0) {#if isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (12:2) <Route {path}>
    function create_default_slot$6(ctx) {
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
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(12:2) <Route {path}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isAuthenticated*/ ctx[2] && create_if_block$a(ctx);

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
    					if_block = create_if_block$a(ctx);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { path: 0, component: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProtectedRoute",
    			options,
    			id: create_fragment$r.name
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
            "name": "balance",
            "display-name": "Balance",
            "primary": '#000000FF',
            "secondary": '#FFFFFFFF',
            "text": "#808080"
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
            "name": 'Greenery',
            "display-name": "Naturen",
            "primary": "#2C5F2D",
            "secondary": "#97BC62FF",
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
        set($value[1].find((c) => c.name === $value[0]).text || '#808080');
    });

    /* src\Public\Login.svelte generated by Svelte v3.48.0 */
    const file$q = "src\\Public\\Login.svelte";

    function create_fragment$q(ctx) {
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
    			attr_dev(h1, "class", "text svelte-1pejrjn");
    			add_location(h1, file$q, 23, 6, 556);
    			attr_dev(p0, "class", "text svelte-1pejrjn");
    			add_location(p0, file$q, 24, 6, 603);
    			attr_dev(div0, "class", "intro svelte-1pejrjn");
    			add_location(div0, file$q, 22, 4, 529);
    			attr_dev(label0, "for", "email");
    			attr_dev(label0, "class", "svelte-1pejrjn");
    			add_location(label0, file$q, 28, 8, 748);
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "name", "email");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-1pejrjn");
    			add_location(input0, file$q, 29, 8, 797);
    			attr_dev(label1, "for", "password");
    			attr_dev(label1, "class", "svelte-1pejrjn");
    			add_location(label1, file$q, 31, 8, 876);
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "type", "password");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-1pejrjn");
    			add_location(input1, file$q, 32, 8, 929);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Login";
    			attr_dev(input2, "class", "w3-button w3-round-small w3-hover-black w3-left-align svelte-1pejrjn");
    			set_style(input2, "height", `45px`, false);
    			set_style(input2, "margin-top", `35px`, false);
    			add_location(input2, file$q, 39, 8, 1070);
    			attr_dev(form, "class", "svelte-1pejrjn");
    			add_location(form, file$q, 27, 6, 699);
    			add_location(div1, file$q, 26, 4, 686);
    			attr_dev(a, "href", "/signup");
    			attr_dev(a, "class", "svelte-1pejrjn");
    			add_location(a, file$q, 51, 11, 1396);
    			add_location(span, file$q, 50, 31, 1378);
    			attr_dev(p1, "class", "w3-section");
    			add_location(p1, file$q, 49, 6, 1323);
    			add_location(div2, file$q, 48, 4, 1310);
    			attr_dev(div3, "class", "content svelte-1pejrjn");
    			add_location(div3, file$q, 21, 2, 502);
    			attr_dev(div4, "class", "container w3-threequarter svelte-1pejrjn");
    			add_location(div4, file$q, 20, 0, 450);
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
    			set_input_value(input0, /*user_*/ ctx[0].email);
    			append_dev(form, t6);
    			append_dev(form, label1);
    			append_dev(form, t8);
    			append_dev(form, input1);
    			set_input_value(input1, /*user_*/ ctx[0].password);
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
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", prevent_default(/*login*/ ctx[1]), false, true, false),
    					action_destroyer(link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user_*/ 1 && input0.value !== /*user_*/ ctx[0].email) {
    				set_input_value(input0, /*user_*/ ctx[0].email);
    			}

    			if (dirty & /*user_*/ 1 && input1.value !== /*user_*/ ctx[0].password) {
    				set_input_value(input1, /*user_*/ ctx[0].password);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let $isLoading;
    	let $user;
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(4, $isLoading = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);

    	let user_ = {
    		email: "samirali@live.dk",
    		password: "123456789"
    	};

    	function login() {
    		set_store_value(isLoading, $isLoading = true, $isLoading);

    		setTimeout(
    			() => {
    				set_store_value(user, $user = { name: "Ali", admin: true }, $user);
    				set_store_value(isLoading, $isLoading = false, $isLoading);
    			},
    			2500
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user_.email = this.value;
    		$$invalidate(0, user_);
    	}

    	function input1_input_handler() {
    		user_.password = this.value;
    		$$invalidate(0, user_);
    	}

    	$$self.$capture_state = () => ({
    		link,
    		slide,
    		isLoading,
    		user,
    		user_,
    		login,
    		$isLoading,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('user_' in $$props) $$invalidate(0, user_ = $$props.user_);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user_, login, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* node_modules\svelte-icons\components\IconBase.svelte generated by Svelte v3.48.0 */

    const file$p = "node_modules\\svelte-icons\\components\\IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$9(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$p, 18, 4, 298);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$9(ctx);
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
    			add_location(svg, file$p, 16, 0, 229);
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
    					if_block = create_if_block$9(ctx);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$p.name
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
    const file$o = "node_modules\\svelte-icons\\ti\\TiArrowBackOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$5(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484v1.437c0 .534-.208 1.036-.586 1.414-.756.756-2.077.751-2.823.005l-6.293-6.207c-.191-.189-.298-.444-.298-.713s.107-.524.298-.712l6.288-6.203c.754-.755 2.073-.756 2.829.001.377.378.585.88.585 1.414v1.704c4.619.933 8 4.997 8 9.796v1c0 .442-.29.832-.714.958-.095.027-.19.042-.286.042-.331 0-.646-.165-.836-.452zm-7.141-5.536c2.207.056 4.638.394 6.758 2.121-.768-3.216-3.477-5.702-6.893-6.08-.504-.056-.888-.052-.888-.052v-3.497l-5.576 5.496 5.576 5.5v-3.499l1.023.011z");
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
    		id: create_default_slot$5.name,
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiArrowBackOutline",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\Public\Signup\Create.svelte generated by Svelte v3.48.0 */
    const file$n = "src\\Public\\Signup\\Create.svelte";

    // (127:23) 
    function create_if_block_1$4(ctx) {
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
    			add_location(h2, file$n, 129, 8, 3199);
    			attr_dev(p, "class", "svelte-pqnp2p");
    			add_location(p, file$n, 130, 8, 3242);
    			attr_dev(div0, "class", "w3-section");
    			add_location(div0, file$n, 128, 6, 3165);
    			input0.required = true;
    			attr_dev(input0, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input0, file$n, 137, 10, 3452);
    			attr_dev(label0, "class", "svelte-pqnp2p");
    			add_location(label0, file$n, 135, 8, 3410);
    			attr_dev(input1, "type", "number");
    			input1.required = true;
    			attr_dev(input1, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input1, file$n, 141, 10, 3577);
    			attr_dev(label1, "class", "svelte-pqnp2p");
    			add_location(label1, file$n, 139, 8, 3542);
    			attr_dev(input2, "type", "tel");
    			input2.required = true;
    			attr_dev(input2, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input2, file$n, 150, 10, 3789);
    			attr_dev(label2, "class", "svelte-pqnp2p");
    			add_location(label2, file$n, 148, 8, 3743);
    			attr_dev(input3, "type", "submit");
    			input3.value = "Opret";
    			attr_dev(input3, "class", "w3-button w3-left-align svelte-pqnp2p");
    			add_location(input3, file$n, 157, 8, 3954);
    			add_location(form, file$n, 134, 6, 3360);
    			attr_dev(div1, "class", "w3-container");
    			add_location(div1, file$n, 127, 4, 3122);
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(127:23) ",
    		ctx
    	});

    	return block;
    }

    // (59:2) {#if step === 0}
    function create_if_block$8(ctx) {
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
    			add_location(h2, file$n, 61, 8, 1370);
    			attr_dev(p, "class", "svelte-pqnp2p");
    			add_location(p, file$n, 62, 8, 1407);
    			attr_dev(div0, "class", "title svelte-pqnp2p");
    			add_location(div0, file$n, 60, 6, 1341);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-pqnp2p");
    			add_location(label0, file$n, 65, 8, 1537);
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input0, "placeholder", "Fornavn");
    			add_location(input0, file$n, 67, 10, 1610);
    			attr_dev(input1, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input1, "placeholder", "Efternavn");
    			add_location(input1, file$n, 73, 10, 1772);
    			attr_dev(span, "class", "name svelte-pqnp2p");
    			add_location(span, file$n, 66, 8, 1579);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", "w3-card-2 svelte-pqnp2p");
    			attr_dev(input2, "placeholder", "Efternavn");
    			input2.required = true;
    			add_location(input2, file$n, 81, 10, 1964);
    			attr_dev(label1, "class", "svelte-pqnp2p");
    			add_location(label1, file$n, 79, 8, 1927);
    			attr_dev(input3, "class", "w3-card-2 svelte-pqnp2p");
    			input3.disabled = true;
    			attr_dev(input3, "placeholder", "deaktiveret");
    			add_location(input3, file$n, 91, 10, 2208);
    			attr_dev(label2, "class", "svelte-pqnp2p");
    			add_location(label2, file$n, 89, 8, 2165);
    			attr_dev(input4, "type", "password");
    			input4.required = true;
    			attr_dev(input4, "class", "w3-card-2 svelte-pqnp2p");
    			add_location(input4, file$n, 100, 10, 2428);
    			attr_dev(label3, "class", "svelte-pqnp2p");
    			add_location(label3, file$n, 98, 8, 2385);
    			attr_dev(input5, "type", "password");
    			input5.required = true;
    			attr_dev(input5, "class", "w3-card-2 svelte-pqnp2p");
    			toggle_class(input5, "error", /*errors*/ ctx[1].find(func));
    			add_location(input5, file$n, 110, 10, 2683);
    			attr_dev(label4, "class", "svelte-pqnp2p");
    			add_location(label4, file$n, 108, 8, 2633);
    			attr_dev(input6, "type", "submit");
    			input6.value = "Næste Trin";
    			attr_dev(input6, "class", "w3-button w3-left-align svelte-pqnp2p");
    			add_location(input6, file$n, 119, 8, 2948);
    			add_location(form, file$n, 64, 6, 1487);
    			attr_dev(div1, "class", "w3-container");
    			add_location(div1, file$n, 59, 4, 1298);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(59:2) {#if step === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*step*/ ctx[0] === 0) return create_if_block$8;
    		if (/*step*/ ctx[0] === 1) return create_if_block_1$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "content");
    			add_location(div, file$n, 57, 0, 1251);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = t => t.name === "rePass";

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { step: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create",
    			options,
    			id: create_fragment$n.name
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

    const file$m = "src\\Public\\Signup\\Join.svelte";

    function create_fragment$m(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$m, 4, 0, 43);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { step: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Join",
    			options,
    			id: create_fragment$m.name
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
    const file$l = "src\\Public\\Signup.svelte";

    // (67:30) 
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
    		source: "(67:30) ",
    		ctx
    	});

    	return block;
    }

    // (65:32) 
    function create_if_block_1$3(ctx) {
    	let create;
    	let updating_step;
    	let current;

    	function create_step_binding(value) {
    		/*create_step_binding*/ ctx[5](value);
    	}

    	let create_props = {};

    	if (/*step*/ ctx[1] !== void 0) {
    		create_props.step = /*step*/ ctx[1];
    	}

    	create = new Create({ props: create_props, $$inline: true });
    	binding_callbacks.push(() => bind(create, 'step', create_step_binding));
    	create.$on("signup", signup);

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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(65:32) ",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if method === "init"}
    function create_if_block$7(ctx) {
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
    			add_location(h2, file$l, 39, 8, 921);
    			attr_dev(p, "class", "svelte-dy5ndi");
    			add_location(p, file$l, 40, 8, 944);
    			attr_dev(div0, "class", "title svelte-dy5ndi");
    			add_location(div0, file$l, 38, 6, 892);
    			attr_dev(b0, "class", "svelte-dy5ndi");
    			add_location(b0, file$l, 49, 10, 1180);
    			attr_dev(small0, "class", "svelte-dy5ndi");
    			add_location(small0, file$l, 50, 10, 1219);
    			attr_dev(div1, "class", "w3-card-2 w3-panel w3-hover-blue card svelte-dy5ndi");
    			add_location(div1, file$l, 43, 8, 1021);
    			attr_dev(b1, "class", "svelte-dy5ndi");
    			add_location(b1, file$l, 58, 10, 1470);
    			attr_dev(small1, "class", "svelte-dy5ndi");
    			add_location(small1, file$l, 59, 10, 1518);
    			attr_dev(div2, "class", "w3-card-2 w3-panel w3-hover-blue card svelte-dy5ndi");
    			add_location(div2, file$l, 52, 8, 1313);
    			add_location(div3, file$l, 42, 6, 1006);
    			add_location(div4, file$l, 62, 6, 1618);
    			attr_dev(div5, "class", "content w3-container svelte-dy5ndi");
    			add_location(div5, file$l, 37, 4, 841);
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
    					listen_dev(div1, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[4], false, false, false)
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(37:2) {#if method === \\\"init\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
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
    	const if_block_creators = [create_if_block$7, create_if_block_1$3, create_if_block_2$2];
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
    			add_location(div0, file$l, 31, 0, 695);
    			attr_dev(div1, "class", "container w3-threequarter svelte-dy5ndi");
    			add_location(div1, file$l, 35, 0, 769);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function signup(e) {
    	e.detail[0];
    	e.detail[1];
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	let method = "init";
    	let step = 0;

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

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
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
    		slide,
    		Create,
    		Join,
    		method,
    		step,
    		goBack,
    		signup
    	});

    	$$self.$inject_state = $$props => {
    		if ('method' in $$props) $$invalidate(0, method = $$props.method);
    		if ('step' in $$props) $$invalidate(1, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [method, step, goBack, click_handler, click_handler_1, create_step_binding];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\Private\Home.svelte generated by Svelte v3.48.0 */
    const file$k = "src\\Private\\Home.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Home";
    			add_location(h1, file$k, 5, 2, 146);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$k, 4, 0, 87);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\Private\Schedule.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\Private\\Schedule.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Vagtplan";
    			add_location(h1, file$j, 5, 2, 146);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$j, 4, 0, 87);
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Schedule",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\Private\Messages.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\Private\\Messages.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Beskeder";
    			add_location(h1, file$i, 5, 2, 133);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$i, 4, 0, 74);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\Private\Employees.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\Private\\Employees.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Medarbejder";
    			add_location(h1, file$h, 5, 2, 146);
    			attr_dev(div, "class", "w3-container container w3-card-4 svelte-1kkbddk");
    			add_location(div, file$h, 4, 0, 87);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Employees', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Employees> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, slide, fly, scale });
    	return [];
    }

    class Employees extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Employees",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\Components\MySettings\General.svelte generated by Svelte v3.48.0 */

    const file$g = "src\\Components\\MySettings\\General.svelte";

    // (7:2) {#if isAdmin}
    function create_if_block$6(ctx) {
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
    			add_location(p0, file$g, 7, 4, 112);
    			input0.value = "Ja";
    			attr_dev(input0, "class", "svelte-f46fca");
    			set_style(input0, "border", `none`, false);
    			add_location(input0, file$g, 8, 4, 138);
    			add_location(p1, file$g, 10, 4, 186);
    			input1.value = "0";
    			attr_dev(input1, "class", "svelte-f46fca");
    			set_style(input1, "border", `none`, false);
    			add_location(input1, file$g, 11, 4, 210);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(7:2) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    	let if_block = /*isAdmin*/ ctx[0] && create_if_block$6(ctx);

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
    			add_location(p0, file$g, 14, 2, 264);
    			input0.readOnly = true;
    			input0.value = "Weeki";
    			attr_dev(input0, "class", "svelte-f46fca");
    			set_style(input0, "border", `none`, false);
    			add_location(input0, file$g, 15, 2, 285);
    			add_location(p1, file$g, 17, 2, 343);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*user*/ ctx[1].name || "ikke registeret";
    			attr_dev(input1, "class", "svelte-f46fca");
    			add_location(input1, file$g, 18, 2, 358);
    			add_location(p2, file$g, 20, 2, 424);
    			attr_dev(input2, "type", "email");
    			input2.value = input2_value_value = /*user*/ ctx[1].email;
    			attr_dev(input2, "class", "svelte-f46fca");
    			add_location(input2, file$g, 21, 2, 440);
    			add_location(p3, file$g, 23, 2, 487);
    			attr_dev(input3, "type", "password");
    			input3.value = input3_value_value = /*user*/ ctx[1].password;
    			attr_dev(input3, "class", "svelte-f46fca");
    			add_location(input3, file$g, 24, 2, 508);
    			add_location(p4, file$g, 26, 2, 561);
    			attr_dev(input4, "type", "number");
    			input4.value = input4_value_value = /*user*/ ctx[1].phone;
    			attr_dev(input4, "class", "svelte-f46fca");
    			add_location(input4, file$g, 27, 2, 584);
    			attr_dev(div, "class", "container svelte-f46fca");
    			add_location(div, file$g, 5, 0, 66);
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
    					if_block = create_if_block$6(ctx);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { isAdmin: 0, user: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$g.name
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

    const file$f = "src\\Components\\MySettings\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (16:4) {#each themes as theme, index}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*theme*/ ctx[5]["display-name"] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*theme*/ ctx[5].name;
    			option.value = option.__value;
    			add_location(option, file$f, 16, 6, 368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*themes*/ 2 && t_value !== (t_value = /*theme*/ ctx[5]["display-name"] + "")) set_data_dev(t, t_value);

    			if (dirty & /*themes*/ 2 && option_value_value !== (option_value_value = /*theme*/ ctx[5].name)) {
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(16:4) {#each themes as theme, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div3;
    	let p0;
    	let t1;
    	let select;
    	let t2;
    	let p1;
    	let t4;
    	let div2;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*themes*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			p0 = element("p");
    			p0.textContent = "Tema";
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Farvepalet";
    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Bekræft Tema";
    			add_location(p0, file$f, 8, 2, 163);
    			attr_dev(select, "default", localStorage.getItem("theme") || "default");
    			attr_dev(select, "class", "svelte-augm4u");
    			if (/*selected*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			set_style(select, "width", `100%`, false);
    			set_style(select, "height", `45px`, false);
    			add_location(select, file$f, 9, 2, 178);
    			add_location(p1, file$f, 20, 2, 459);
    			set_style(div0, "height", `45px`, false);
    			set_style(div0, "width", `50%`, false);
    			set_style(div0, "background-color", /*selectedTheme*/ ctx[2].primary, false);
    			add_location(div0, file$f, 22, 4, 530);
    			set_style(div1, "height", `45px`, false);
    			set_style(div1, "width", `50%`, false);
    			set_style(div1, "background-color", /*selectedTheme*/ ctx[2].secondary, false);
    			add_location(div1, file$f, 27, 4, 654);
    			attr_dev(div2, "class", "w3-border");
    			set_style(div2, "display", `flex`, false);
    			add_location(div2, file$f, 21, 2, 480);
    			attr_dev(button, "class", "w3-button w3-hover");
    			set_style(button, "background-color", /*selectedTheme*/ ctx[2].primary, false);
    			set_style(button, "color", /*selectedTheme*/ ctx[2].text, false);
    			add_location(button, file$f, 33, 2, 788);
    			attr_dev(div3, "class", "container svelte-augm4u");
    			add_location(div3, file$f, 7, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p0);
    			append_dev(div3, t1);
    			append_dev(div3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selected*/ ctx[0]);
    			append_dev(div3, t2);
    			append_dev(div3, p1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div3, t6);
    			append_dev(div3, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false)
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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

    			if (dirty & /*selectedTheme*/ 4) {
    				set_style(div0, "background-color", /*selectedTheme*/ ctx[2].primary, false);
    			}

    			if (dirty & /*selectedTheme*/ 4) {
    				set_style(div1, "background-color", /*selectedTheme*/ ctx[2].secondary, false);
    			}

    			if (dirty & /*selectedTheme*/ 4) {
    				set_style(button, "background-color", /*selectedTheme*/ ctx[2].primary, false);
    			}

    			if (dirty & /*selectedTheme*/ 4) {
    				set_style(button, "color", /*selectedTheme*/ ctx[2].text, false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	let selectedTheme;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { themes } = $$props;
    	let { selected } = $$props;
    	const writable_props = ['themes', 'selected'];

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
    	};

    	$$self.$capture_state = () => ({ themes, selected, selectedTheme });

    	$$self.$inject_state = $$props => {
    		if ('themes' in $$props) $$invalidate(1, themes = $$props.themes);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selectedTheme' in $$props) $$invalidate(2, selectedTheme = $$props.selectedTheme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*themes, selected*/ 3) {
    			$$invalidate(2, selectedTheme = themes.find(th => th.name === selected));
    		}
    	};

    	return [selected, themes, selectedTheme, click_handler, select_change_handler];
    }

    class App$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { themes: 1, selected: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$f.name
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
    }

    /* src\Private\MySettings.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\Private\\MySettings.svelte";

    // (49:31) 
    function create_if_block_2$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "mere";
    			add_location(h1, file$e, 49, 4, 1364);
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
    		source: "(49:31) ",
    		ctx
    	});

    	return block;
    }

    // (45:30) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let app;
    	let updating_selected;
    	let div_intro;
    	let current;

    	function app_selected_binding(value) {
    		/*app_selected_binding*/ ctx[9](value);
    	}

    	let app_props = { themes: /*$themes*/ ctx[4] };

    	if (/*selected*/ ctx[1] !== void 0) {
    		app_props.selected = /*selected*/ ctx[1];
    	}

    	app = new App$1({ props: app_props, $$inline: true });
    	binding_callbacks.push(() => bind(app, 'selected', app_selected_binding));
    	app.$on("click", /*changeTheme*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(app.$$.fragment);
    			add_location(div, file$e, 45, 4, 1230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(app, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const app_changes = {};
    			if (dirty & /*$themes*/ 16) app_changes.themes = /*$themes*/ ctx[4];

    			if (!updating_selected && dirty & /*selected*/ 2) {
    				updating_selected = true;
    				app_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(45:30) ",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if current === "general"}
    function create_if_block$5(ctx) {
    	let div;
    	let general;
    	let div_intro;
    	let current;

    	general = new General({
    			props: {
    				isAdmin: /*$isAdmin*/ ctx[2],
    				user: /*$user*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(general.$$.fragment);
    			add_location(div, file$e, 41, 4, 1115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(general, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const general_changes = {};
    			if (dirty & /*$isAdmin*/ 4) general_changes.isAdmin = /*$isAdmin*/ ctx[2];
    			if (dirty & /*$user*/ 8) general_changes.user = /*$user*/ ctx[3];
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(41:2) {#if current === \\\"general\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
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
    	const if_block_creators = [create_if_block$5, create_if_block_1$2, create_if_block_2$1];
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
    			add_location(h1, file$e, 19, 2, 527);
    			attr_dev(div0, "class", "w3-container container w3-card-4 svelte-oyp7k0");
    			add_location(div0, file$e, 18, 0, 468);
    			attr_dev(span0, "class", "w3-button w3-hover-light-grey svelte-oyp7k0");
    			toggle_class(span0, "active", /*current*/ ctx[0] === "general");
    			add_location(span0, file$e, 22, 2, 585);
    			attr_dev(span1, "class", "w3-button w3-hover-light-grey svelte-oyp7k0");
    			toggle_class(span1, "active", /*current*/ ctx[0] === "app");
    			add_location(span1, file$e, 27, 2, 743);
    			attr_dev(span2, "class", "w3-button w3-hover-light-grey svelte-oyp7k0");
    			toggle_class(span2, "active", /*current*/ ctx[0] === "mere");
    			add_location(span2, file$e, 32, 2, 888);
    			attr_dev(div1, "class", "tab svelte-oyp7k0");
    			add_location(div1, file$e, 21, 0, 564);
    			attr_dev(div2, "class", "w3-container content");
    			add_location(div2, file$e, 39, 0, 1044);
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
    					listen_dev(span0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(span1, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(span2, "click", /*click_handler_2*/ ctx[8], false, false, false)
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $theme;
    	let $isAdmin;
    	let $user;
    	let $themes;
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(10, $theme = $$value));
    	validate_store(isAdmin, 'isAdmin');
    	component_subscribe($$self, isAdmin, $$value => $$invalidate(2, $isAdmin = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	validate_store(themes, 'themes');
    	component_subscribe($$self, themes, $$value => $$invalidate(4, $themes = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MySettings', slots, []);
    	let current = "general";
    	let selected = $theme;

    	function changeTheme() {
    		localStorage.setItem("theme", selected);
    		set_store_value(theme, $theme = selected, $theme);
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
    		changeTheme,
    		$theme,
    		$isAdmin,
    		$user,
    		$themes
    	});

    	$$self.$inject_state = $$props => {
    		if ('current' in $$props) $$invalidate(0, current = $$props.current);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		current,
    		selected,
    		$isAdmin,
    		$user,
    		$themes,
    		changeTheme,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		app_selected_binding
    	];
    }

    class MySettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MySettings",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\NotFound.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\NotFound.svelte";

    function create_fragment$d(ctx) {
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
    			add_location(h1, file$d, 16, 2, 367);
    			attr_dev(div0, "class", "w3-container container svelte-1nvj3d4");
    			add_location(div0, file$d, 15, 0, 318);
    			add_location(b, file$d, 20, 2, 466);
    			add_location(h2, file$d, 23, 4, 600);
    			attr_dev(div1, "class", "w3-container w3-large w3-section");
    			add_location(div1, file$d, 22, 2, 548);
    			attr_dev(div2, "class", "w3-container w3-border content svelte-1nvj3d4");
    			add_location(div2, file$d, 19, 0, 418);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	let counter = 5;
    	const dcr = () => $$invalidate(0, counter -= 1);
    	let clear = setInterval(dcr, 1000);

    	setTimeout(
    		() => {
    			clearInterval(clear);
    			navigate("/", { replace: true });
    		},
    		5000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ navigate, slide, counter, dcr, clear });

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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\Components\Logo.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$c = "src\\Components\\Logo.svelte";

    function create_fragment$c(ctx) {
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
    			add_location(span, file$c, 40, 2, 828);
    			attr_dev(p, "class", "svelte-k33ykr");
    			add_location(p, file$c, 41, 2, 846);
    			attr_dev(div, "id", "logo");
    			attr_dev(div, "style", /*logoStyles*/ ctx[0]);
    			attr_dev(div, "class", "svelte-k33ykr");
    			add_location(div, file$c, 39, 0, 790);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$c.name
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

    /* src\CommingSoon.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\CommingSoon.svelte";

    // (34:4) {#if info}
    function create_if_block$4(ctx) {
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
    	let div1;
    	let b1;
    	let t9;
    	let ul1;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let li5;
    	let t15;
    	let li6;
    	let t17;
    	let div2;
    	let b2;
    	let t19;
    	let ul2;
    	let li7;
    	let t21;
    	let li8;
    	let t23;
    	let li9;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			b0 = element("b");
    			b0.textContent = "For dig der er leder";
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Du får kontrol og overblik over dine ansatte";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Du får kontrol og overblik over vagtplanen";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Du kan nemt og hurtigt kommunikere med dine ansatte";
    			t7 = space();
    			div1 = element("div");
    			b1 = element("b");
    			b1.textContent = "For dig der er ansat";
    			t9 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Du får kontrol og overblik over dine vagter";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "Søg ferie/fri dag/sygdag og mere gennem appen";
    			t13 = space();
    			li5 = element("li");
    			li5.textContent = "Byt vagter med dine kollegaer";
    			t15 = space();
    			li6 = element("li");
    			li6.textContent = "Anmod om flere vagter eller færre";
    			t17 = space();
    			div2 = element("div");
    			b2 = element("b");
    			b2.textContent = "For Alle";
    			t19 = space();
    			ul2 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Din data er sikker hos os, vi vidergiver ikke data til tredjepart";
    			t21 = space();
    			li8 = element("li");
    			li8.textContent = "Du behøver ikke at nøjes med vores Original Tema, du kan vælge fra\r\n              et divers udvalg eller vælg dine helt egene unikke tema";
    			t23 = space();
    			li9 = element("li");
    			li9.textContent = "Vores mål er at gøre vores produkt til et brugervenligt produkt,\r\n              dvs. at du skal kunne tage kontrol over alt hvad du gerne vil tage\r\n              kontrol over";
    			add_location(b0, file$b, 38, 10, 1043);
    			add_location(li0, file$b, 40, 12, 1100);
    			add_location(li1, file$b, 41, 12, 1167);
    			add_location(li2, file$b, 42, 12, 1232);
    			attr_dev(ul0, "class", "svelte-zc9yqs");
    			add_location(ul0, file$b, 39, 10, 1082);
    			attr_dev(div0, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div0, file$b, 35, 8, 905);
    			add_location(b1, file$b, 48, 10, 1473);
    			add_location(li3, file$b, 50, 12, 1530);
    			add_location(li4, file$b, 51, 12, 1596);
    			add_location(li5, file$b, 52, 12, 1664);
    			add_location(li6, file$b, 53, 12, 1716);
    			attr_dev(ul1, "class", "svelte-zc9yqs");
    			add_location(ul1, file$b, 49, 10, 1512);
    			attr_dev(div1, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div1, file$b, 45, 8, 1335);
    			add_location(b2, file$b, 59, 10, 1939);
    			add_location(li7, file$b, 61, 12, 1984);
    			add_location(li8, file$b, 64, 12, 2102);
    			add_location(li9, file$b, 68, 12, 2292);
    			attr_dev(ul2, "class", "svelte-zc9yqs");
    			add_location(ul2, file$b, 60, 10, 1966);
    			attr_dev(div2, "class", "content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom svelte-zc9yqs");
    			add_location(div2, file$b, 56, 8, 1801);
    			attr_dev(div3, "class", "container content-container svelte-zc9yqs");
    			add_location(div3, file$b, 34, 6, 854);
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
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, b1);
    			append_dev(div1, t9);
    			append_dev(div1, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t11);
    			append_dev(ul1, li4);
    			append_dev(ul1, t13);
    			append_dev(ul1, li5);
    			append_dev(ul1, t15);
    			append_dev(ul1, li6);
    			append_dev(div3, t17);
    			append_dev(div3, div2);
    			append_dev(div2, b2);
    			append_dev(div2, t19);
    			append_dev(div2, ul2);
    			append_dev(ul2, li7);
    			append_dev(ul2, t21);
    			append_dev(ul2, li8);
    			append_dev(ul2, t23);
    			append_dev(ul2, li9);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(34:4) {#if info}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
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
    	let if_block = /*info*/ ctx[0] && create_if_block$4(ctx);

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
    			add_location(div0, file$b, 9, 4, 232);
    			add_location(h1, file$b, 12, 4, 282);
    			add_location(b0, file$b, 14, 6, 355);
    			attr_dev(div1, "class", "w3-center w3-section");
    			add_location(div1, file$b, 13, 4, 313);
    			add_location(b1, file$b, 18, 31, 508);
    			attr_dev(p0, "class", "svelte-zc9yqs");
    			add_location(p0, file$b, 17, 6, 472);
    			attr_dev(div2, "class", "content w3-container w3-center svelte-zc9yqs");
    			add_location(div2, file$b, 16, 4, 419);
    			attr_dev(div3, "class", "container w3-container w3-border svelte-zc9yqs");
    			attr_dev(div3, "style", /*styles*/ ctx[1]);
    			add_location(div3, file$b, 8, 2, 165);
    			attr_dev(p1, "class", "w3-button w3-hover-blue svelte-zc9yqs");
    			add_location(p1, file$b, 24, 4, 661);
    			attr_dev(div4, "class", "container svelte-zc9yqs");
    			add_location(div4, file$b, 23, 2, 632);
    			attr_dev(div5, "class", "main svelte-zc9yqs");
    			add_location(div5, file$b, 7, 0, 143);
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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommingSoon",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Circle2.svelte generated by Svelte v3.48.0 */

    const file$a = "node_modules\\svelte-loading-spinners\\dist\\Circle2.svelte";

    function create_fragment$a(ctx) {
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
    			add_location(div, file$a, 56, 0, 1412);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
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
    			id: create_fragment$a.name
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
    const file$9 = "src\\Components\\Loader.svelte";

    function create_fragment$9(ctx) {
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
    			add_location(div, file$9, 7, 0, 199);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { styles: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get styles() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Layouts\Public.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\Layouts\\Public.svelte";

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
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(40:4) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    	const if_block_creators = [create_if_block$3, create_else_block$3];
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
    			attr_dev(div0, "class", "content w3-half container svelte-1mp8p8e");
    			add_location(div0, file$8, 38, 2, 1308);
    			attr_dev(div1, "id", "logo");
    			attr_dev(div1, "class", "logo w3-half w3-black container w3-hide-small svelte-1mp8p8e");
    			add_location(div1, file$8, 45, 2, 1441);
    			attr_dev(div2, "class", "main w3-row svelte-1mp8p8e");
    			attr_dev(div2, "style", /*styles*/ ctx[3]);
    			add_location(div2, file$8, 37, 0, 1264);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function clicked() {
    	
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Public",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiThMenu.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules\\svelte-icons\\ti\\TiThMenu.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$4(ctx) {
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
    		id: create_default_slot$4.name,
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

    /* node_modules\svelte-icons\go\GoSignOut.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules\\svelte-icons\\go\\GoSignOut.svelte";

    // (4:8) <IconBase viewBox="0 0 16 17" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 9V7H8V5h4V3l4 3-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v11.38c0 .39.22.73.55.91L6 16.01V13h4c.55 0 1-.45 1-1V8h-1v4z");
    			add_location(path, file$6, 4, 10, 151);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 16 17\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 16 17" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GoSignOut', slots, []);

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

    class GoSignOut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoSignOut",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiTimesOutline.svelte generated by Svelte v3.48.0 */
    const file$5 = "node_modules\\svelte-icons\\ti\\TiTimesOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 19c-.802 0-1.555-.312-2.122-.879l-1.878-1.879-1.879 1.879c-1.133 1.133-3.109 1.133-4.243 0-.566-.566-.878-1.32-.878-2.121s.312-1.555.879-2.122l1.878-1.878-1.878-1.879c-.567-.566-.879-1.32-.879-2.121s.312-1.555.879-2.122c1.133-1.132 3.109-1.133 4.243.001l1.878 1.879 1.879-1.879c1.133-1.133 3.109-1.133 4.243 0 .566.566.878 1.32.878 2.121s-.312 1.555-.879 2.122l-1.878 1.878 1.878 1.879c.567.566.879 1.32.879 2.121s-.312 1.555-.879 2.122c-.566.566-1.319.878-2.121.878zm-4-5.586l3.293 3.293c.378.378 1.037.377 1.414 0 .189-.189.293-.439.293-.707s-.104-.518-.293-.707l-3.292-3.293 3.292-3.293c.189-.189.293-.44.293-.707s-.104-.518-.293-.707c-.378-.379-1.037-.378-1.414-.001l-3.293 3.294-3.293-3.293c-.378-.378-1.037-.377-1.414 0-.189.189-.293.44-.293.707s.104.518.293.707l3.292 3.293-3.292 3.293c-.189.189-.293.439-.293.707s.104.518.293.707c.378.379 1.037.378 1.414.001l3.293-3.294z");
    			add_location(path, file$5, 4, 10, 151);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TiTimesOutline', slots, []);

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

    class TiTimesOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiTimesOutline",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosSettings.svelte generated by Svelte v3.48.0 */
    const file$4 = "node_modules\\svelte-icons\\io\\IoIosSettings.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M416.3 256c0-21 13.1-38.9 31.7-46.1-4.9-20.5-13-39.7-23.7-57.1-6.4 2.8-13.2 4.3-20.1 4.3-12.6 0-25.2-4.8-34.9-14.4-14.9-14.9-18.2-36.8-10.2-55-17.3-10.7-36.6-18.8-57-23.7C295 82.5 277 95.7 256 95.7S217 82.5 209.9 64c-20.5 4.9-39.7 13-57.1 23.7 8.1 18.1 4.7 40.1-10.2 55-9.6 9.6-22.3 14.4-34.9 14.4-6.9 0-13.7-1.4-20.1-4.3C77 170.3 68.9 189.5 64 210c18.5 7.1 31.7 25 31.7 46.1 0 21-13.1 38.9-31.6 46.1 4.9 20.5 13 39.7 23.7 57.1 6.4-2.8 13.2-4.2 20-4.2 12.6 0 25.2 4.8 34.9 14.4 14.8 14.8 18.2 36.8 10.2 54.9 17.4 10.7 36.7 18.8 57.1 23.7 7.1-18.5 25-31.6 46-31.6s38.9 13.1 46 31.6c20.5-4.9 39.7-13 57.1-23.7-8-18.1-4.6-40 10.2-54.9 9.6-9.6 22.2-14.4 34.9-14.4 6.8 0 13.7 1.4 20 4.2 10.7-17.4 18.8-36.7 23.7-57.1-18.4-7.2-31.6-25.1-31.6-46.2zm-159.4 79.9c-44.3 0-80-35.9-80-80s35.7-80 80-80 80 35.9 80 80-35.7 80-80 80z");
    			add_location(path, file$4, 4, 10, 153);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosSettings",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Components\NavBar.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src\\Components\\NavBar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (86:6) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let titimesoutline;
    	let div_intro;
    	let current;
    	titimesoutline = new TiTimesOutline({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(titimesoutline.$$.fragment);
    			attr_dev(div, "class", "icon svelte-13dg2l2");
    			add_location(div, file$3, 86, 8, 2297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(titimesoutline, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titimesoutline.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, scale, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titimesoutline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(titimesoutline);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(86:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#if !menuOpen}
    function create_if_block_3(ctx) {
    	let div;
    	let tithmenu;
    	let div_intro;
    	let current;
    	tithmenu = new TiThMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tithmenu.$$.fragment);
    			attr_dev(div, "class", "icon svelte-13dg2l2");
    			add_location(div, file$3, 82, 8, 2205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tithmenu, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tithmenu.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, scale, {});
    					div_intro.start();
    				});
    			}

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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(82:6) {#if !menuOpen}",
    		ctx
    	});

    	return block;
    }

    // (116:4) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let logo;
    	let div_intro;
    	let current;
    	logo = new Logo({ props: { size: "M" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(logo.$$.fragment);
    			attr_dev(div, "class", "logo-container svelte-13dg2l2");
    			add_location(div, file$3, 116, 6, 3091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(logo, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(logo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(116:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if menuOpen}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t;
    	let div_intro;
    	let each_value = /*links_list*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*isAdmin*/ ctx[0] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "link-container svelte-13dg2l2");
    			add_location(div, file$3, 94, 6, 2489);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links_list, $page*/ 40) {
    				each_value = /*links_list*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*isAdmin*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(94:4) {#if menuOpen}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#each links_list as item}
    function create_each_block(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[13][1] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*item*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", /*item*/ ctx[13][0]);
    			attr_dev(a, "class", "link svelte-13dg2l2");
    			toggle_class(a, "current", /*$page*/ ctx[3] === /*item*/ ctx[13][0]);
    			add_location(a, file$3, 96, 10, 2574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a)),
    					listen_dev(a, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$page, links_list*/ 40) {
    				toggle_class(a, "current", /*$page*/ ctx[3] === /*item*/ ctx[13][0]);
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
    		source: "(96:8) {#each links_list as item}",
    		ctx
    	});

    	return block;
    }

    // (106:8) {#if isAdmin}
    function create_if_block_2(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Medarbejder";
    			attr_dev(a, "href", "/employees");
    			attr_dev(a, "class", "link svelte-13dg2l2");
    			toggle_class(a, "current", /*$page*/ ctx[3] === "/employees");
    			add_location(a, file$3, 106, 10, 2827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a)),
    					listen_dev(a, "click", /*click_handler_2*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$page*/ 8) {
    				toggle_class(a, "current", /*$page*/ ctx[3] === "/employees");
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(106:8) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    // (123:2) {#if !menuOpen}
    function create_if_block$2(ctx) {
    	let div2;
    	let div0;
    	let ioiossettings;
    	let t;
    	let div1;
    	let gosignout;
    	let current;
    	let mounted;
    	let dispose;
    	ioiossettings = new IoIosSettings({ $$inline: true });
    	gosignout = new GoSignOut({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(ioiossettings.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(gosignout.$$.fragment);
    			attr_dev(div0, "class", "icon svelte-13dg2l2");
    			toggle_class(div0, "current", /*$page*/ ctx[3] === "/mysettings");
    			add_location(div0, file$3, 124, 6, 3251);
    			attr_dev(div1, "class", "icon svelte-13dg2l2");
    			add_location(div1, file$3, 131, 6, 3420);
    			attr_dev(div2, "class", "tool-icons svelte-13dg2l2");
    			add_location(div2, file$3, 123, 4, 3219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(ioiossettings, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(gosignout, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*goToMySettings*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$page*/ 8) {
    				toggle_class(div0, "current", /*$page*/ ctx[3] === "/mysettings");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiossettings.$$.fragment, local);
    			transition_in(gosignout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiossettings.$$.fragment, local);
    			transition_out(gosignout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(ioiossettings);
    			destroy_component(gosignout);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(123:2) {#if !menuOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let div2;
    	let current_block_type_index_1;
    	let if_block1;
    	let div2_intro;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_3, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*menuOpen*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_1$1, create_else_block$2];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*menuOpen*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let if_block2 = !/*menuOpen*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			add_location(div0, file$3, 76, 4, 2095);
    			attr_dev(div1, "class", "menu svelte-13dg2l2");
    			set_style(div1, "width", `70px`, false);
    			add_location(div1, file$3, 75, 2, 2052);
    			attr_dev(div2, "class", "links svelte-13dg2l2");
    			toggle_class(div2, "mobile", /*menuOpen*/ ctx[1]);
    			add_location(div2, file$3, 92, 2, 2409);
    			attr_dev(div3, "class", "nav svelte-13dg2l2");
    			add_location(div3, file$3, 66, 0, 1917);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			if_blocks_1[current_block_type_index_1].m(div2, null);
    			append_dev(div3, t1);
    			if (if_block2) if_block2.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(div3, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, null);
    			}

    			if (dirty & /*menuOpen*/ 2) {
    				toggle_class(div2, "mobile", /*menuOpen*/ ctx[1]);
    			}

    			if (!/*menuOpen*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*menuOpen*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, slide, {});
    					div2_intro.start();
    				});
    			}

    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $page;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(3, $page = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	let { isAdmin } = $$props;
    	let { isLoading } = $$props;

    	/**
     * menuOpen is used for to show the menu
     * and indicate to other parts of the component wheter it is open or not
     * navFocus is used to not close the menu as long as mouse is inside navBar
     *
     */
    	let menuOpen = false;

    	let navFocus = false;

    	/**
     * reactive if statement, to ensure menu is not closed
     * when user is using the menu,
     * and is auto closing when the focus is away from the menu
     * by clearing the timeOut if navfocused and menu is open
     * if the user leaves the navbar but comes back before the menu is close
     * it is annoying if it closes while one tries to navigate the menu
     */
    	let clear;

    	function goToMySettings() {
    		$$invalidate(6, isLoading = true);

    		setTimeout(
    			() => {
    				$$invalidate(6, isLoading = false);
    				set_store_value(page, $page = "/mysettings", $page);
    				navigate("/mysettings");
    			},
    			2500
    		);
    	}

    	//array with available links > endpoint : Name
    	const links_list = [["/", "Oversigt"], ["/schedule", "Vagtplan"], ["/messages", "Beskeder"]];

    	console.log(links_list[0][1]);
    	const writable_props = ['isAdmin', 'isLoading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, menuOpen = !menuOpen);
    	};

    	const click_handler_1 = item => set_store_value(page, $page = item[0], $page);
    	const click_handler_2 = () => set_store_value(page, $page = "/employees", $page);

    	const mouseleave_handler = () => {
    		$$invalidate(2, navFocus = false);
    	};

    	const mouseenter_handler = () => {
    		$$invalidate(2, navFocus = true);
    	};

    	$$self.$$set = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(0, isAdmin = $$props.isAdmin);
    		if ('isLoading' in $$props) $$invalidate(6, isLoading = $$props.isLoading);
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
    		isLoading,
    		menuOpen,
    		navFocus,
    		TiThMenu,
    		GoSignOut,
    		TiTimesOutline,
    		IoIosSettings,
    		clear,
    		goToMySettings,
    		links_list,
    		$page
    	});

    	$$self.$inject_state = $$props => {
    		if ('isAdmin' in $$props) $$invalidate(0, isAdmin = $$props.isAdmin);
    		if ('isLoading' in $$props) $$invalidate(6, isLoading = $$props.isLoading);
    		if ('menuOpen' in $$props) $$invalidate(1, menuOpen = $$props.menuOpen);
    		if ('navFocus' in $$props) $$invalidate(2, navFocus = $$props.navFocus);
    		if ('clear' in $$props) $$invalidate(7, clear = $$props.clear);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$page*/ 8) {
    			// update the sessionStorage each time the page state changes
    			sessionStorage.setItem("lastVisited", $page);
    		}

    		if ($$self.$$.dirty & /*navFocus, menuOpen, clear*/ 134) {
    			if (!navFocus && menuOpen) {
    				$$invalidate(7, clear = setTimeout(
    					() => {
    						$$invalidate(1, menuOpen = false);
    					},
    					2500
    				));
    			} else if (navFocus && menuOpen) {
    				clearTimeout(clear);
    			}
    		}
    	};

    	return [
    		isAdmin,
    		menuOpen,
    		navFocus,
    		$page,
    		goToMySettings,
    		links_list,
    		isLoading,
    		clear,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		mouseleave_handler,
    		mouseenter_handler
    	];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { isAdmin: 0, isLoading: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isAdmin*/ ctx[0] === undefined && !('isAdmin' in props)) {
    			console_1$1.warn("<NavBar> was created without expected prop 'isAdmin'");
    		}

    		if (/*isLoading*/ ctx[6] === undefined && !('isLoading' in props)) {
    			console_1$1.warn("<NavBar> was created without expected prop 'isLoading'");
    		}
    	}

    	get isAdmin() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAdmin(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLoading() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLoading(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\Components\\Footer.svelte";

    function create_fragment$2(ctx) {
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
    			add_location(p, file$2, 6, 4, 128);
    			add_location(div0, file$2, 8, 4, 164);
    			attr_dev(div1, "class", "footer-container w3-padding svelte-1hps5az");
    			add_location(div1, file$2, 5, 2, 81);
    			attr_dev(footer, "class", " svelte-1hps5az");
    			add_location(footer, file$2, 4, 0, 60);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Layouts\Private.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;

    const file$1 = "src\\Layouts\\Private.svelte";

    // (33:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
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
    		source: "(33:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if $isLoading}
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:4) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let navbar;
    	let updating_isLoading;
    	let t0;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;

    	function navbar_isLoading_binding(value) {
    		/*navbar_isLoading_binding*/ ctx[9](value);
    	}

    	let navbar_props = { isAdmin: /*$isAdmin*/ ctx[3] };

    	if (/*$isLoading*/ ctx[4] !== void 0) {
    		navbar_props.isLoading = /*$isLoading*/ ctx[4];
    	}

    	navbar = new NavBar({ props: navbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(navbar, 'isLoading', navbar_isLoading_binding));
    	const if_block_creators = [create_if_block$1, create_else_block$1];
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
    			attr_dev(div0, "class", "main svelte-7n0x0k");
    			add_location(div0, file$1, 29, 2, 735);
    			attr_dev(div1, "style", /*cssVarStyles*/ ctx[2]);
    			add_location(div1, file$1, 27, 0, 644);
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

    			if (!updating_isLoading && dirty & /*$isLoading*/ 16) {
    				updating_isLoading = true;
    				navbar_changes.isLoading = /*$isLoading*/ ctx[4];
    				add_flush_callback(() => updating_isLoading = false);
    			}

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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let styles;
    	let cssVarStyles;
    	let $text_color;
    	let $secondary_color;
    	let $primary_color;
    	let $isAdmin;
    	let $isLoading;
    	validate_store(text_color, 'text_color');
    	component_subscribe($$self, text_color, $$value => $$invalidate(6, $text_color = $$value));
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
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Private> was created with unknown prop '${key}'`);
    	});

    	function navbar_isLoading_binding(value) {
    		$isLoading = value;
    		isLoading.set($isLoading);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		NavBar,
    		Footer,
    		Loader,
    		isAdmin,
    		primary_color,
    		secondary_color,
    		text_color,
    		isLoading,
    		styles,
    		cssVarStyles,
    		$text_color,
    		$secondary_color,
    		$primary_color,
    		$isAdmin,
    		$isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(5, styles = $$props.styles);
    		if ('cssVarStyles' in $$props) $$invalidate(2, cssVarStyles = $$props.cssVarStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$primary_color, $secondary_color, $text_color*/ 67) {
    			$$invalidate(5, styles = {
    				"primary-color": $primary_color,
    				"secondary-color": $secondary_color,
    				"text-color": $text_color,
    				font: '"Gluten", cursive'
    			});
    		}

    		if ($$self.$$.dirty & /*styles*/ 32) {
    			$$invalidate(2, cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(";"));
    		}
    	};

    	return [
    		$secondary_color,
    		$primary_color,
    		cssVarStyles,
    		$isAdmin,
    		$isLoading,
    		styles,
    		$text_color,
    		$$scope,
    		slots,
    		navbar_isLoading_binding
    	];
    }

    class Private extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Private",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (49:0) {:else}
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

    			if (dirty & /*$$scope, $loggedIn*/ 65) {
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
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:0) {#if development}
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
    		source: "(47:0) {#if development}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {:else}
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

    			if (dirty & /*$$scope*/ 64) {
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
    		source: "(64:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if $loggedIn}
    function create_if_block_1(ctx) {
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
    			add_location(main, file, 51, 6, 1385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(private_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const private_1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(51:4) {#if $loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (66:8) <Route path="/">
    function create_default_slot_6(ctx) {
    	let login_1;
    	let current;
    	login_1 = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(66:8) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:8) <Route path="/signup">
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
    		source: "(69:8) <Route path=\\\"/signup\\\">",
    		ctx
    	});

    	return block;
    }

    // (72:8) <Route>
    function create_default_slot_4(ctx) {
    	let div;
    	let notfound;
    	let current;
    	notfound = new NotFound({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(notfound.$$.fragment);
    			add_location(div, file, 72, 10, 2039);
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
    		source: "(72:8) <Route>",
    		ctx
    	});

    	return block;
    }

    // (65:6) <Public>
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

    			if (dirty & /*$$scope*/ 64) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
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
    		source: "(65:6) <Public>",
    		ctx
    	});

    	return block;
    }

    // (59:10) <Route>
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
    		source: "(59:10) <Route>",
    		ctx
    	});

    	return block;
    }

    // (53:8) <Private>
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

    			if (dirty & /*$$scope*/ 64) {
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
    		source: "(53:8) <Private>",
    		ctx
    	});

    	return block;
    }

    // (50:2) <Router>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$loggedIn*/ ctx[0]) return 0;
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
    		source: "(50:2) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*development*/ ctx[1]) return 0;
    		return 1;
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
    			if_block.p(ctx, dirty);
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
    	let $isLoading;
    	let $user;
    	let $page;
    	let $loggedIn;
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(2, $isLoading = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(4, $page = $$value));
    	validate_store(loggedIn, 'loggedIn');
    	component_subscribe($$self, loggedIn, $$value => $$invalidate(0, $loggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		if ($loggedIn) {
    			navigate($page);
    		} else {
    			navigate("/");
    		}
    	});

    	function login() {
    		console.log(user_);
    		set_store_value(isLoading, $isLoading = true, $isLoading);

    		setTimeout(
    			() => {
    				set_store_value(
    					user,
    					$user = {
    						name: "ali",
    						email: "samirali@live.dk",
    						admin: true
    					},
    					$user
    				);

    				set_store_value(isLoading, $isLoading = false, $isLoading);
    			},
    			1500
    		);
    	}

    	let development = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
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
    		CommingSoon,
    		Public,
    		Private,
    		onMount,
    		page,
    		isLoading,
    		loggedIn,
    		user,
    		login,
    		development,
    		$isLoading,
    		$user,
    		$page,
    		$loggedIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('development' in $$props) $$invalidate(1, development = $$props.development);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$loggedIn, development];
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
