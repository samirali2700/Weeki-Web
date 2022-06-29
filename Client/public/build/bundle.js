
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function empty$1() {
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
    function tick() {
        schedule_update();
        return resolved_promise;
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
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
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
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

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

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

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

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
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

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
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
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
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
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick$1(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
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

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

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
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick$1([route], uri);
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

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.48.0 */

    const file$1r = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$l(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$1r, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1x(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$l(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$1r, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
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
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$1x($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick: pick$1,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick$1($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1x,
    			create_fragment$1x,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$1x.name
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

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.48.0 */
    const file$1q = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context$1 = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$k(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$B] },
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
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
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
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$1);

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
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
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
    		id: create_else_block$c.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
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
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
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
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$B(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$b, create_else_block$c];
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
    			if_block_anchor = empty$1();
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
    		id: create_default_slot$B.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1w(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$1q, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$1q, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
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
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$1w($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1w, create_fragment$1w, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1w.name
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

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createAction = getAnchor => (node, navigate$1 = navigate) => {
    	const handleClick = event => {
    		const anchor = getAnchor(event);
    		if (anchor && anchor.target === "" && shouldNavigate(event)) {
    			event.preventDefault();
    			const to = anchor.pathname + anchor.search + anchor.hash;
    			navigate$1(to, { replace: anchor.hasAttribute("replace") });
    		}
    	};
    	const unlisten = addListener(node, "click", handleClick);
    	return { destroy: unlisten };
    };

    // prettier-ignore
    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    const link = /*#__PURE__*/createAction(event => event.currentTarget); // eslint-disable-line spaced-comment, max-len

    /* node_modules\svelte-loading-spinners\dist\Circle2.svelte generated by Svelte v3.48.0 */

    const file$1p = "node_modules\\svelte-loading-spinners\\dist\\Circle2.svelte";

    function create_fragment$1v(ctx) {
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
    			add_location(div, file$1p, 56, 0, 1412);
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
    		id: create_fragment$1v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1v($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$1v, create_fragment$1v, safe_not_equal, {
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
    			id: create_fragment$1v.name
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

    const durationUnitRegex = /[a-zA-Z]/;
    const calculateRgba = (color, opacity) => {
        if (color[0] === "#") {
            color = color.slice(1);
        }
        if (color.length === 3) {
            let res = "";
            color.split("").forEach((c) => {
                res += c;
                res += c;
            });
            color = res;
        }
        const rgbValues = (color.match(/.{2}/g) || [])
            .map((hex) => parseInt(hex, 16))
            .join(", ");
        return `rgba(${rgbValues}, ${opacity})`;
    };
    const range = (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);
    // export const characterRange = (startChar, endChar) =>
    //   String.fromCharCode(
    //     ...range(
    //       endChar.charCodeAt(0) - startChar.charCodeAt(0),
    //       startChar.charCodeAt(0)
    //     )
    //   );
    // export const zip = (arr, ...arrs) =>
    //   arr.map((val, i) => arrs.reduce((list, curr) => [...list, curr[i]], [val]));

    /* node_modules\svelte-loading-spinners\dist\DoubleBounce.svelte generated by Svelte v3.48.0 */
    const file$1o = "node_modules\\svelte-loading-spinners\\dist\\DoubleBounce.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (41:2) {#each range(2, 1) as version}
    function create_each_block$f(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "circle svelte-h1a2xs");

    			set_style(div, "animation", /*duration*/ ctx[2] + " " + (/*version*/ ctx[6] === 1
    			? `${(/*durationNum*/ ctx[5] - 0.1) / 2}${/*durationUnit*/ ctx[4]}`
    			: `0s`) + " infinite ease-in-out");

    			add_location(div, file$1o, 41, 4, 936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*duration*/ 4) {
    				set_style(div, "animation", /*duration*/ ctx[2] + " " + (/*version*/ ctx[6] === 1
    				? `${(/*durationNum*/ ctx[5] - 0.1) / 2}${/*durationUnit*/ ctx[4]}`
    				: `0s`) + " infinite ease-in-out");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(41:2) {#each range(2, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1u(ctx) {
    	let div;
    	let each_value = range(2, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-h1a2xs");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			add_location(div, file$1o, 39, 0, 828);
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
    			if (dirty & /*duration, range, durationNum, durationUnit*/ 52) {
    				each_value = range(2, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DoubleBounce', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "2.1s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DoubleBounce> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class DoubleBounce extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1u, create_fragment$1u, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DoubleBounce",
    			options,
    			id: create_fragment$1u.name
    		});
    	}

    	get color() {
    		throw new Error("<DoubleBounce>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<DoubleBounce>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<DoubleBounce>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<DoubleBounce>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<DoubleBounce>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<DoubleBounce>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DoubleBounce>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DoubleBounce>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\GoogleSpin.svelte generated by Svelte v3.48.0 */

    const file$1n = "node_modules\\svelte-loading-spinners\\dist\\GoogleSpin.svelte";

    function create_fragment$1t(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "spinner spinner--google svelte-1exboqr");
    			attr_dev(div, "style", div_style_value = "--duration: " + /*duration*/ ctx[0] + "; " + /*styles*/ ctx[1]);
    			add_location(div, file$1n, 6, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*duration, styles*/ 3 && div_style_value !== (div_style_value = "--duration: " + /*duration*/ ctx[0] + "; " + /*styles*/ ctx[1])) {
    				attr_dev(div, "style", div_style_value);
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
    		id: create_fragment$1t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1t($$self, $$props, $$invalidate) {
    	let styles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GoogleSpin', slots, []);
    	let { size = "40px" } = $$props;
    	let { duration = "3s" } = $$props;
    	const writable_props = ['size', 'duration'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GoogleSpin> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('duration' in $$props) $$invalidate(0, duration = $$props.duration);
    	};

    	$$self.$capture_state = () => ({ size, duration, styles });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('duration' in $$props) $$invalidate(0, duration = $$props.duration);
    		if ('styles' in $$props) $$invalidate(1, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 4) {
    			$$invalidate(1, styles = [`width: ${size}`, `height: ${size}`].join(";"));
    		}
    	};

    	return [duration, styles, size];
    }

    class GoogleSpin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1t, create_fragment$1t, safe_not_equal, { size: 2, duration: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoogleSpin",
    			options,
    			id: create_fragment$1t.name
    		});
    	}

    	get size() {
    		throw new Error("<GoogleSpin>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<GoogleSpin>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<GoogleSpin>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<GoogleSpin>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\ScaleOut.svelte generated by Svelte v3.48.0 */

    const file$1m = "node_modules\\svelte-loading-spinners\\dist\\ScaleOut.svelte";

    function create_fragment$1s(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "circle svelte-9juun5");
    			add_location(div0, file$1m, 35, 2, 758);
    			attr_dev(div1, "class", "wrapper svelte-9juun5");
    			set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div1, "--color", /*color*/ ctx[0]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			add_location(div1, file$1m, 32, 0, 631);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScaleOut', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScaleOut> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class ScaleOut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1s, create_fragment$1s, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScaleOut",
    			options,
    			id: create_fragment$1s.name
    		});
    	}

    	get color() {
    		throw new Error("<ScaleOut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ScaleOut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<ScaleOut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<ScaleOut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<ScaleOut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<ScaleOut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ScaleOut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ScaleOut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\SpinLine.svelte generated by Svelte v3.48.0 */

    const file$1l = "node_modules\\svelte-loading-spinners\\dist\\SpinLine.svelte";

    function create_fragment$1r(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "line svelte-1wp57lu");
    			add_location(div0, file$1l, 85, 2, 1719);
    			attr_dev(div1, "class", "wrapper svelte-1wp57lu");
    			set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div1, "--color", /*color*/ ctx[0]);
    			set_style(div1, "--stroke", /*stroke*/ ctx[4]);
    			set_style(div1, "--floatSize", /*size*/ ctx[3]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			add_location(div1, file$1l, 82, 0, 1576);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*stroke*/ 16) {
    				set_style(div1, "--stroke", /*stroke*/ ctx[4]);
    			}

    			if (dirty & /*size*/ 8) {
    				set_style(div1, "--floatSize", /*size*/ ctx[3]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinLine', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "4s" } = $$props;
    	let { size = "60" } = $$props;
    	let { stroke = +size / 12 + unit } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size', 'stroke'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpinLine> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('stroke' in $$props) $$invalidate(4, stroke = $$props.stroke);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size, stroke });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('stroke' in $$props) $$invalidate(4, stroke = $$props.stroke);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, stroke];
    }

    class SpinLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1r, create_fragment$1r, safe_not_equal, {
    			color: 0,
    			unit: 1,
    			duration: 2,
    			size: 3,
    			stroke: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinLine",
    			options,
    			id: create_fragment$1r.name
    		});
    	}

    	get color() {
    		throw new Error("<SpinLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SpinLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<SpinLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<SpinLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<SpinLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<SpinLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<SpinLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SpinLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<SpinLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<SpinLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Stretch.svelte generated by Svelte v3.48.0 */
    const file$1k = "node_modules\\svelte-loading-spinners\\dist\\Stretch.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (42:2) {#each range(5, 1) as version}
    function create_each_block$e(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "rect svelte-1uxpkwt");
    			set_style(div, "animation-delay", (/*version*/ ctx[6] - 1) * (+/*durationNum*/ ctx[5] / 12) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$1k, 42, 4, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(42:2) {#each range(5, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1q(ctx) {
    	let div;
    	let each_value = range(5, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-1uxpkwt");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1k, 38, 0, 821);
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
    			if (dirty & /*range, durationNum, durationUnit*/ 48) {
    				each_value = range(5, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stretch', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.2s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stretch> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Stretch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1q, create_fragment$1q, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stretch",
    			options,
    			id: create_fragment$1q.name
    		});
    	}

    	get color() {
    		throw new Error("<Stretch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Stretch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Stretch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Stretch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Stretch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Stretch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Stretch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Stretch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\BarLoader.svelte generated by Svelte v3.48.0 */
    const file$1j = "node_modules\\svelte-loading-spinners\\dist\\BarLoader.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (74:2) {#each range(2, 1) as version}
    function create_each_block$d(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "lines small-lines " + /*version*/ ctx[5] + " svelte-vhcw6");
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1j, 74, 4, 1591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(74:2) {#each range(2, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1p(ctx) {
    	let div;
    	let each_value = range(2, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-vhcw6");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--rgba", /*rgba*/ ctx[4]);
    			add_location(div, file$1j, 72, 0, 1486);
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
    			if (dirty & /*range, color, duration*/ 5) {
    				each_value = range(2, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*rgba*/ 16) {
    				set_style(div, "--rgba", /*rgba*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BarLoader', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "2.1s" } = $$props;
    	let { size = "60" } = $$props;
    	let rgba;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BarLoader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		calculateRgba,
    		range,
    		color,
    		unit,
    		duration,
    		size,
    		rgba
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('rgba' in $$props) $$invalidate(4, rgba = $$props.rgba);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 1) {
    			$$invalidate(4, rgba = calculateRgba(color, 0.2));
    		}
    	};

    	return [color, unit, duration, size, rgba];
    }

    class BarLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1p, create_fragment$1p, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BarLoader",
    			options,
    			id: create_fragment$1p.name
    		});
    	}

    	get color() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<BarLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<BarLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Jumper.svelte generated by Svelte v3.48.0 */
    const file$1i = "node_modules\\svelte-loading-spinners\\dist\\Jumper.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (44:2) {#each range(3, 1) as version}
    function create_each_block$c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "circle svelte-1cy66mt");
    			set_style(div, "animation-delay", /*durationNum*/ ctx[5] / 3 * (/*version*/ ctx[6] - 1) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$1i, 44, 4, 991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(44:2) {#each range(3, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1o(ctx) {
    	let div;
    	let each_value = range(3, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-1cy66mt");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1i, 40, 0, 852);
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
    			if (dirty & /*durationNum, range, durationUnit*/ 48) {
    				each_value = range(3, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Jumper', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Jumper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Jumper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1o, create_fragment$1o, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Jumper",
    			options,
    			id: create_fragment$1o.name
    		});
    	}

    	get color() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\RingLoader.svelte generated by Svelte v3.48.0 */
    const file$1h = "node_modules\\svelte-loading-spinners\\dist\\RingLoader.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (57:2) {#each range(2, 1) as version}
    function create_each_block$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "border " + /*version*/ ctx[4] + " svelte-17ey38u");
    			add_location(div, file$1h, 57, 4, 1321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(57:2) {#each range(2, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1n(ctx) {
    	let div;
    	let each_value = range(2, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-17ey38u");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1h, 53, 0, 1182);
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
    			if (dirty & /*range*/ 0) {
    				each_value = range(2, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RingLoader', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "2s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RingLoader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ range, color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class RingLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1n, create_fragment$1n, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RingLoader",
    			options,
    			id: create_fragment$1n.name
    		});
    	}

    	get color() {
    		throw new Error("<RingLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<RingLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<RingLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<RingLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<RingLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<RingLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<RingLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<RingLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\SyncLoader.svelte generated by Svelte v3.48.0 */
    const file$1g = "node_modules\\svelte-loading-spinners\\dist\\SyncLoader.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (61:2) {#each range(3, 1) as i}
    function create_each_block$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "dot svelte-14w6xk7");
    			set_style(div, "--dotSize", +/*size*/ ctx[3] * 0.25 + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "animation-delay", /*i*/ ctx[6] * (+/*durationNum*/ ctx[5] / 10) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$1g, 61, 4, 1491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--dotSize", +/*size*/ ctx[3] * 0.25 + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(61:2) {#each range(3, 1) as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1m(ctx) {
    	let div;
    	let each_value = range(3, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-14w6xk7");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1g, 59, 0, 1383);
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
    			if (dirty & /*size, unit, color, range, durationNum, durationUnit*/ 59) {
    				each_value = range(3, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SyncLoader', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "0.6s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SyncLoader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class SyncLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1m, create_fragment$1m, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SyncLoader",
    			options,
    			id: create_fragment$1m.name
    		});
    	}

    	get color() {
    		throw new Error("<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Wave.svelte generated by Svelte v3.48.0 */
    const file$1f = "node_modules\\svelte-loading-spinners\\dist\\Wave.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (48:2) {#each range(10, 0) as version}
    function create_each_block$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "bar svelte-8cmcz4");
    			set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 5 + (+/*size*/ ctx[3] / 15 - +/*size*/ ctx[3] / 100)) + /*unit*/ ctx[1]);
    			set_style(div, "animation-delay", /*version*/ ctx[6] * (+/*durationNum*/ ctx[5] / 8.3) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$1f, 48, 4, 1193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 5 + (+/*size*/ ctx[3] / 15 - +/*size*/ ctx[3] / 100)) + /*unit*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(48:2) {#each range(10, 0) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1l(ctx) {
    	let div;
    	let each_value = range(10, 0);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-8cmcz4");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1f, 44, 0, 1053);
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
    			if (dirty & /*range, size, unit, durationNum, durationUnit*/ 58) {
    				each_value = range(10, 0);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wave', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.25s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wave> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Wave extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1l, create_fragment$1l, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wave",
    			options,
    			id: create_fragment$1l.name
    		});
    	}

    	get color() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Firework.svelte generated by Svelte v3.48.0 */

    const file$1e = "node_modules\\svelte-loading-spinners\\dist\\Firework.svelte";

    function create_fragment$1k(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "firework svelte-1x2s7pr");
    			add_location(div0, file$1e, 41, 2, 866);
    			attr_dev(div1, "class", "wrapper svelte-1x2s7pr");
    			set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div1, "--color", /*color*/ ctx[0]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			add_location(div1, file$1e, 38, 0, 763);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Firework', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.25s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Firework> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class Firework extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1k, create_fragment$1k, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Firework",
    			options,
    			id: create_fragment$1k.name
    		});
    	}

    	get color() {
    		throw new Error("<Firework>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Firework>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Firework>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Firework>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Firework>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Firework>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Firework>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Firework>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Pulse.svelte generated by Svelte v3.48.0 */
    const file$1d = "node_modules\\svelte-loading-spinners\\dist\\Pulse.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (45:2) {#each range(3, 0) as version}
    function create_each_block$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "cube svelte-446r86");
    			set_style(div, "animation-delay", /*version*/ ctx[6] * (+/*durationNum*/ ctx[5] / 10) + /*durationUnit*/ ctx[4]);
    			set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 3 + +/*size*/ ctx[3] / 15) + /*unit*/ ctx[1]);
    			add_location(div, file$1d, 45, 4, 1049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 3 + +/*size*/ ctx[3] / 15) + /*unit*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(45:2) {#each range(3, 0) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1j(ctx) {
    	let div;
    	let each_value = range(3, 0);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-446r86");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1d, 41, 0, 911);
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
    			if (dirty & /*range, durationNum, durationUnit, size, unit*/ 58) {
    				each_value = range(3, 0);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pulse', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.5s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pulse> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Pulse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1j, create_fragment$1j, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pulse",
    			options,
    			id: create_fragment$1j.name
    		});
    	}

    	get color() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Chasing.svelte generated by Svelte v3.48.0 */
    const file$1c = "node_modules\\svelte-loading-spinners\\dist\\Chasing.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (55:4) {#each range(2, 0) as version}
    function create_each_block$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "dot svelte-1unnvn6");

    			set_style(div, "animation-delay", /*version*/ ctx[6] === 1
    			? `${/*durationNum*/ ctx[5] / 2}${/*durationUnit*/ ctx[4]}`
    			: '0s');

    			set_style(div, "bottom", /*version*/ ctx[6] === 1 ? '0' : '');
    			set_style(div, "top", /*version*/ ctx[6] === 1 ? 'auto' : '');
    			add_location(div, file$1c, 55, 6, 1219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(55:4) {#each range(2, 0) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1i(ctx) {
    	let div1;
    	let div0;
    	let each_value = range(2, 0);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "spinner svelte-1unnvn6");
    			add_location(div0, file$1c, 53, 2, 1154);
    			attr_dev(div1, "class", "wrapper svelte-1unnvn6");
    			set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div1, "--color", /*color*/ ctx[0]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			add_location(div1, file$1c, 50, 0, 1051);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*range, durationNum, durationUnit*/ 48) {
    				each_value = range(2, 0);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chasing', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "2s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chasing> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		durationUnitRegex,
    		range,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Chasing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1i, create_fragment$1i, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chasing",
    			options,
    			id: create_fragment$1i.name
    		});
    	}

    	get color() {
    		throw new Error("<Chasing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Chasing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Chasing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Chasing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Chasing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Chasing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Chasing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Chasing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Shadow.svelte generated by Svelte v3.48.0 */

    const file$1b = "node_modules\\svelte-loading-spinners\\dist\\Shadow.svelte";

    function create_fragment$1h(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "shadow svelte-tycttu");
    			add_location(div0, file$1b, 73, 2, 1978);
    			attr_dev(div1, "class", "wrapper svelte-tycttu");
    			set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div1, "--color", /*color*/ ctx[0]);
    			set_style(div1, "--duration", /*duration*/ ctx[2]);
    			add_location(div1, file$1b, 70, 0, 1875);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div1, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div1, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Shadow', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.7s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Shadow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class Shadow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1h, create_fragment$1h, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Shadow",
    			options,
    			id: create_fragment$1h.name
    		});
    	}

    	get color() {
    		throw new Error("<Shadow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Shadow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Shadow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Shadow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Shadow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Shadow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Shadow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Shadow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Square.svelte generated by Svelte v3.48.0 */

    const file$1a = "node_modules\\svelte-loading-spinners\\dist\\Square.svelte";

    function create_fragment$1g(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "square svelte-btmyrn");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1a, 38, 0, 952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
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
    		id: create_fragment$1g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Square', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "3s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Square> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class Square extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1g, create_fragment$1g, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Square",
    			options,
    			id: create_fragment$1g.name
    		});
    	}

    	get color() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Moon.svelte generated by Svelte v3.48.0 */

    const file$19 = "node_modules\\svelte-loading-spinners\\dist\\Moon.svelte";

    function create_fragment$1f(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "circle-one svelte-nlgli4");
    			add_location(div0, file$19, 47, 2, 1200);
    			attr_dev(div1, "class", "circle-two svelte-nlgli4");
    			add_location(div1, file$19, 48, 2, 1230);
    			attr_dev(div2, "class", "wrapper svelte-nlgli4");
    			set_style(div2, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div2, "--color", /*color*/ ctx[0]);
    			set_style(div2, "--moonSize", /*top*/ ctx[4] + /*unit*/ ctx[1]);
    			set_style(div2, "--duration", /*duration*/ ctx[2]);
    			add_location(div2, file$19, 44, 0, 1072);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div2, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div2, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*unit*/ 2) {
    				set_style(div2, "--moonSize", /*top*/ ctx[4] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div2, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Moon', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "0.6s" } = $$props;
    	let { size = "60" } = $$props;
    	let moonSize = +size / 7;
    	let top = +size / 2 - moonSize / 2;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Moon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		color,
    		unit,
    		duration,
    		size,
    		moonSize,
    		top
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('moonSize' in $$props) moonSize = $$props.moonSize;
    		if ('top' in $$props) $$invalidate(4, top = $$props.top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, top];
    }

    class Moon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1f, create_fragment$1f, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Moon",
    			options,
    			id: create_fragment$1f.name
    		});
    	}

    	get color() {
    		throw new Error("<Moon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Moon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Moon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Moon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Moon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Moon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Moon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Moon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Plane.svelte generated by Svelte v3.48.0 */
    const file$18 = "node_modules\\svelte-loading-spinners\\dist\\Plane.svelte";

    function create_fragment$1e(ctx) {
    	let div7;
    	let div6;
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let div5;
    	let div4;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			attr_dev(div0, "class", "plane svelte-1sqavxm");
    			add_location(div0, file$18, 115, 6, 2415);
    			attr_dev(div1, "id", "top");
    			attr_dev(div1, "class", "mask svelte-1sqavxm");
    			add_location(div1, file$18, 114, 4, 2380);
    			attr_dev(div2, "class", "plane svelte-1sqavxm");
    			add_location(div2, file$18, 118, 6, 2492);
    			attr_dev(div3, "id", "middle");
    			attr_dev(div3, "class", "mask svelte-1sqavxm");
    			add_location(div3, file$18, 117, 4, 2454);
    			attr_dev(div4, "class", "plane svelte-1sqavxm");
    			add_location(div4, file$18, 121, 6, 2569);
    			attr_dev(div5, "id", "bottom");
    			attr_dev(div5, "class", "mask svelte-1sqavxm");
    			add_location(div5, file$18, 120, 4, 2531);
    			attr_dev(div6, "class", "spinner-inner svelte-1sqavxm");
    			add_location(div6, file$18, 113, 2, 2347);
    			attr_dev(div7, "class", "wrapper svelte-1sqavxm");
    			set_style(div7, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div7, "--color", /*color*/ ctx[0]);
    			set_style(div7, "--rgba", /*rgba*/ ctx[4]);
    			set_style(div7, "--duration", /*duration*/ ctx[2]);
    			add_location(div7, file$18, 110, 0, 2228);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div6, t0);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div7, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div7, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*rgba*/ 16) {
    				set_style(div7, "--rgba", /*rgba*/ ctx[4]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div7, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Plane', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.3s" } = $$props;
    	let { size = "60" } = $$props;
    	let rgba;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Plane> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		calculateRgba,
    		color,
    		unit,
    		duration,
    		size,
    		rgba
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('rgba' in $$props) $$invalidate(4, rgba = $$props.rgba);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 1) {
    			$$invalidate(4, rgba = calculateRgba(color, 0.6));
    		}
    	};

    	return [color, unit, duration, size, rgba];
    }

    class Plane extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1e, create_fragment$1e, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plane",
    			options,
    			id: create_fragment$1e.name
    		});
    	}

    	get color() {
    		throw new Error("<Plane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Plane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Plane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Plane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Plane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Plane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Plane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Plane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Diamonds.svelte generated by Svelte v3.48.0 */

    const file$17 = "node_modules\\svelte-loading-spinners\\dist\\Diamonds.svelte";

    function create_fragment$1d(ctx) {
    	let span;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "svelte-evhfle");
    			add_location(div0, file$17, 48, 2, 1147);
    			attr_dev(div1, "class", "svelte-evhfle");
    			add_location(div1, file$17, 49, 2, 1158);
    			attr_dev(div2, "class", "svelte-evhfle");
    			add_location(div2, file$17, 50, 2, 1169);
    			set_style(span, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(span, "--color", /*color*/ ctx[0]);
    			set_style(span, "--duration", /*duration*/ ctx[2]);
    			attr_dev(span, "class", "svelte-evhfle");
    			add_location(span, file$17, 47, 0, 1066);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, div0);
    			append_dev(span, t0);
    			append_dev(span, div1);
    			append_dev(span, t1);
    			append_dev(span, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(span, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(span, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(span, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Diamonds', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.5s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Diamonds> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class Diamonds extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1d, create_fragment$1d, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Diamonds",
    			options,
    			id: create_fragment$1d.name
    		});
    	}

    	get color() {
    		throw new Error("<Diamonds>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Diamonds>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Diamonds>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Diamonds>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Diamonds>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Diamonds>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Diamonds>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Diamonds>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-loading-spinners\dist\Clock.svelte generated by Svelte v3.48.0 */

    const file$16 = "node_modules\\svelte-loading-spinners\\dist\\Clock.svelte";

    function create_fragment$1c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			attr_dev(div, "class", "svelte-1cgj772");
    			add_location(div, file$16, 45, 0, 1149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
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
    		id: create_fragment$1c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Clock', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "8s" } = $$props;
    	let { size = "60" } = $$props;
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Clock> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, unit, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size];
    }

    class Clock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1c, create_fragment$1c, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clock",
    			options,
    			id: create_fragment$1c.name
    		});
    	}

    	get color() {
    		throw new Error("<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Loader.svelte generated by Svelte v3.48.0 */

    // (67:0) {:else}
    function create_else_block$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[4];

    	function switch_props(ctx) {
    		return {
    			props: {
    				size: /*size*/ ctx[2],
    				color: /*color*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*size*/ 4) switch_instance_changes.size = /*size*/ ctx[2];
    			if (dirty & /*color*/ 8) switch_instance_changes.color = /*color*/ ctx[3];

    			if (switch_value !== (switch_value = /*component*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
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
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(67:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:0) {#if type === 'Circle2'}
    function create_if_block$j(ctx) {
    	let circle2;
    	let current;

    	circle2 = new Circle2({
    			props: {
    				size: /*size*/ ctx[2],
    				colorOuter: /*styles*/ ctx[0].outer,
    				colorCenter: /*styles*/ ctx[0].center,
    				colorInner: /*styles*/ ctx[0].outer
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(circle2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(circle2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const circle2_changes = {};
    			if (dirty & /*size*/ 4) circle2_changes.size = /*size*/ ctx[2];
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
    			destroy_component(circle2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(60:0) {#if type === 'Circle2'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$j, create_else_block$b];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[1] === 'Circle2') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
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
    		id: create_fragment$1b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { styles = { outer: '#0088ff', center: '#000' } } = $$props;
    	let { type = 'Circle2' } = $$props;
    	let { size = 80 } = $$props;
    	let { color = styles.outer } = $$props;

    	const loaders = [
    		{ name: 'Chasing', component: Chasing },
    		{ name: 'Shadow', component: Shadow },
    		{ name: 'Diamonds', component: Diamonds },
    		{ name: 'Plane', component: Plane },
    		{ name: 'BarLoader', component: BarLoader },
    		{ name: 'SpinLine', component: SpinLine },
    		{
    			name: 'DoubleBounce',
    			component: DoubleBounce
    		},
    		{ name: 'Stretch', component: Stretch },
    		{
    			name: 'GoogleSpin',
    			component: GoogleSpin
    		},
    		{ name: 'ScaleOut', component: ScaleOut },
    		{
    			name: 'RingLoader',
    			component: RingLoader
    		},
    		{
    			name: 'SyncLoader',
    			component: SyncLoader
    		},
    		{ name: 'Jumper', component: Jumper },
    		{ name: 'Wave', component: Wave },
    		{ name: 'Firework', component: Firework },
    		{ name: 'Square', component: Square },
    		{ name: 'Pulse', component: Pulse },
    		{ name: 'Moon', component: Moon },
    		{ name: 'Clock', component: Clock }
    	];

    	const component = type !== 'Circle2'
    	? loaders.find(c => c.name === type).component
    	: undefined;

    	const writable_props = ['styles', 'type', 'size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({
    		Circle2,
    		Chasing,
    		Shadow,
    		Diamonds,
    		Plane,
    		BarLoader,
    		SpinLine,
    		DoubleBounce,
    		Stretch,
    		GoogleSpin,
    		ScaleOut,
    		RingLoader,
    		SyncLoader,
    		Jumper,
    		Wave,
    		Firework,
    		Square,
    		Pulse,
    		Moon,
    		Clock,
    		styles,
    		type,
    		size,
    		color,
    		loaders,
    		component
    	});

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [styles, type, size, color, component];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1b, create_fragment$1b, safe_not_equal, { styles: 0, type: 1, size: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$1b.name
    		});
    	}

    	get styles() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Logo.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$15 = "src\\Components\\Logo.svelte";

    function create_fragment$1a(ctx) {
    	let div;
    	let p;
    	let span;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			span = element("span");
    			span.textContent = "W";
    			t1 = text("eeki");
    			attr_dev(span, "class", "svelte-1npypr6");
    			add_location(span, file$15, 32, 19, 617);
    			attr_dev(p, "translate", "no");
    			attr_dev(p, "class", "svelte-1npypr6");
    			add_location(p, file$15, 32, 1, 599);
    			attr_dev(div, "id", "logo");
    			attr_dev(div, "style", /*logoStyles*/ ctx[0]);
    			attr_dev(div, "class", "w3-animate-zoom svelte-1npypr6");
    			add_location(div, file$15, 31, 0, 538);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, span);
    			append_dev(p, t1);
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
    		id: create_fragment$1a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1a($$self, $$props, $$invalidate) {
    	let styles;
    	let logoStyles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { size } = $$props;

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
    		w_size,
    		eeki_size,
    		styles,
    		logoStyles
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
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
    			if (size === 'L') {
    				$$invalidate(2, w_size = '156px');
    				$$invalidate(3, eeki_size = '106px');
    			} else if (size === 'M') {
    				$$invalidate(2, w_size = '76px');
    				$$invalidate(3, eeki_size = '46px');
    			} else if (size === 'S') {
    				$$invalidate(2, w_size = '36px');
    				$$invalidate(3, eeki_size = '16px');
    			} else {
    				$$invalidate(2, w_size = '56px');
    				$$invalidate(3, eeki_size = '36px');
    			}
    		}

    		if ($$self.$$.dirty & /*w_size, eeki_size*/ 12) {
    			$$invalidate(4, styles = { 'w-size': w_size, 'eeki-size': eeki_size });
    		}

    		if ($$self.$$.dirty & /*styles*/ 16) {
    			$$invalidate(0, logoStyles = Object.entries(styles).map(([key, value]) => `--${key}: ${value}`).join(';'));
    		}
    	};

    	return [logoStyles, size, w_size, eeki_size, styles];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1a, create_fragment$1a, safe_not_equal, { size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$1a.name
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

    const auth = '/auth/';
    const api = '/api/';

    const SIGNOUT = async () => {
    	const response = await fetch(auth + 'signout', { method: 'DELETE' });
    	const { success, error } = await response.json();
    	return { success, error };
    };

    const authGet = async (url) => {
    	let fetchUrl = auth;
    	if (url !== null) {
    		fetchUrl += `${url}`;
    	}
    	const response = await fetch(fetchUrl);
    	const { payload, error } = await response.json();
    	return { payload, error };
    };
    const apiGet = async (url) => {
    	const response = await fetch(`${api}${url}`);
    	const { payload, error } = await response.json();
    	return { payload, error };
    };

    const authPost = async (url, body) => {
    	const response = await fetch(`${auth}${url}`, {
    		method: 'POST',
    		headers: { 'Content-type': 'application/json' },
    		body: JSON.stringify(body),
    	});
    	const { payload, error } = await response.json();
    	return { payload, error };
    };
    const apiPost = async (url, body) => {
    	const response = await fetch(`${api}${url}`, {
    		method: 'POST',
    		headers: { 'Content-type': 'application/json' },
    		body: JSON.stringify(body),
    	});
    	const { payload, error } = await response.json();
    	return { payload, error };
    };
    const apiPatch = async (url, body) => {
    	const response = await fetch(`${api}${url}`, {
    		method: 'PATCH',
    		headers: { 'Content-type': 'application/json' },
    		body: JSON.stringify(body),
    	});
    	const { payload, error } = await response.json();
    	return { payload, error };
    };

    const apiDelete = async (url) => {
    	const response = await fetch(`${api}${url}`, { method: 'DELETE' });
    	const { payload, error } = await response.json();
    	return { payload, error };
    };

    const user = writable({});
    const isLoading$1 = writable(false);

    const loggedIn = derived(user, ($user) => {
    	if (Object.keys($user).length > 0) {
    		return true;
    	}
    	return false;
    });

    const isAdmin = derived([loggedIn, user], ($value, set) => {
    	if ($value[0]) {
    		if ($value[1].admin) {
    			set(true);
    		} else set(false);
    	}
    });

    const invitationInfo = writable(false);

    const authEndpoint = 'auth/';

    const GET_COMPANY = (companyId) =>
    	authEndpoint + 'companies/' + companyId;
    const GET_EMPLOYEES = () => authEndpoint + 'employees/';

    const invitationEndpoint = 'invitations/registrationToken/';
    const GET_INVITATION_VALIDATION = (token) =>
    	invitationEndpoint + 'validation/' + token;
    const GET_INVITATION_TOKEN = (email) =>
    	'auth/' + invitationEndpoint + email;

    const POST_INVITATION_VALIDATION = (type) =>
    	invitationEndpoint + 'validation?type=' + type;
    const POST_INVITATION_TOKEN = (email) =>
    	'auth/' + invitationEndpoint + email;

    const POST_COMPANY = (creatorId) => 'companies/' + creatorId;
    const POST_EMPLOYEE = (companyId) => 'employees/' + companyId;

    const DELETE_COMPANY = () => 'auth/companies/';
    const DELETE_EMPLOYEE = (employeeId) => 'auth/employees/' + employeeId;

    const userEndpoint = '/users/';

    const POST_USER = ({ companyId, userId }) =>
    	userEndpoint + companyId + '/' + userId;
    const PATCH_USER = () => 'auth' + userEndpoint;

    const GET_LOGIN = () => 'auth' + userEndpoint + 'profile/login';
    const SIGNIN = () => 'signin';
    const SIGNUP = () => 'signup';

    const postEndpoint = '/posts/';

    const GET_POSTS = () => 'auth' + postEndpoint;
    const POST_POST = () => 'auth' + postEndpoint;
    const DELETE_POST = (postId) => 'auth' + postEndpoint + postId;

    /* src\Layouts\Public.svelte generated by Svelte v3.48.0 */
    const file$14 = "src\\Layouts\\Public.svelte";

    function create_fragment$19(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let logo;
    	let updating_size;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[5]);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	function logo_size_binding(value) {
    		/*logo_size_binding*/ ctx[6](value);
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
    			if (default_slot) default_slot.c();
    			t = space();
    			div1 = element("div");
    			create_component(logo.$$.fragment);
    			attr_dev(div0, "class", "container parent svelte-1frnoi8");
    			toggle_class(div0, "w3-half", /*width*/ ctx[0] > 992);
    			add_location(div0, file$14, 40, 1, 955);
    			attr_dev(div1, "id", "logo");
    			attr_dev(div1, "class", "logo w3-half w3-black container w3-hide-medium svelte-1frnoi8");
    			add_location(div1, file$14, 43, 1, 1037);
    			attr_dev(div2, "class", "main w3-row svelte-1frnoi8");
    			attr_dev(div2, "style", /*styles*/ ctx[2]);
    			add_location(div2, file$14, 39, 0, 912);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(logo, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*width*/ 1) {
    				toggle_class(div0, "w3-half", /*width*/ ctx[0] > 992);
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
    			transition_in(default_slot, local);
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(logo);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$19.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$19($$self, $$props, $$invalidate) {
    	let $invitationInfo;
    	validate_store(invitationInfo, 'invitationInfo');
    	component_subscribe($$self, invitationInfo, $$value => $$invalidate(7, $invitationInfo = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Public', slots, ['default']);

    	onMount(async () => {
    		const { payload } = await apiPost(POST_INVITATION_VALIDATION('status'), {});

    		if (payload) {
    			set_store_value(
    				invitationInfo,
    				$invitationInfo = {
    					email: payload.info.email,
    					companyId: payload.info.companyId,
    					companyName: payload.info.name
    				},
    				$invitationInfo
    			);

    			if (payload.redirect) {
    				navigate('/signup/join');
    			}
    		}
    	});

    	const styles = `--secondary-color: #0088ff;`;
    	let width;
    	let size = 'L';
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
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Logo,
    		onMount,
    		apiPost,
    		navigate,
    		invitationInfo,
    		POST_INVITATION_VALIDATION,
    		styles,
    		width,
    		size,
    		$invitationInfo
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
    			if (width < 900 && size === 'L') {
    				$$invalidate(1, size = 'M');
    			} else if (width > 900 && size === 'M') {
    				$$invalidate(1, size = 'L');
    			}
    		}
    	};

    	return [width, size, styles, $$scope, slots, onwindowresize, logo_size_binding];
    }

    class Public extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$19, create_fragment$19, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Public",
    			options,
    			id: create_fragment$19.name
    		});
    	}
    }

    /* node_modules\svelte-icons\components\IconBase.svelte generated by Svelte v3.48.0 */

    const file$13 = "node_modules\\svelte-icons\\components\\IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$i(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$13, 18, 4, 298);
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
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$18(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$i(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$13, 16, 0, 229);
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
    					if_block = create_if_block$i(ctx);
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
    		id: create_fragment$18.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$18($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$18, create_fragment$18, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$18.name
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

    /* node_modules\svelte-icons\io\IoIosEye.svelte generated by Svelte v3.48.0 */
    const file$12 = "node_modules\\svelte-icons\\io\\IoIosEye.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$A(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M255.8 112c-80.4 0-143.8 50.6-219.6 133.3-5.5 6.1-5.6 15.2-.1 21.3C101 338.3 158.2 400 255.8 400c96.4 0 168.7-77.7 220.1-134 5.3-5.8 5.6-14.6.5-20.7C424 181.8 351.5 112 255.8 112zm4.4 233.9c-53 2.4-96.6-41.2-94.1-94.1 2.1-46.2 39.5-83.6 85.7-85.7 53-2.4 96.6 41.2 94.1 94.1-2.1 46.2-39.5 83.6-85.7 85.7z");
    			add_location(path0, file$12, 4, 10, 153);
    			attr_dev(path1, "d", "M256 209c0-6 1.1-11.7 3.1-16.9-1 0-2-.1-3.1-.1-36.9 0-66.6 31.4-63.8 68.9 2.4 31.3 27.6 56.5 58.9 58.9 37.5 2.8 68.9-26.9 68.9-63.8 0-1.3-.1-2.6-.1-3.9-5.6 2.5-11.7 3.9-18.2 3.9-25.2 0-45.7-21.1-45.7-47z");
    			add_location(path1, file$12, 5, 0, 470);
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
    		id: create_default_slot$A.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$17(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$A] },
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
    		id: create_fragment$17.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$17($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosEye', slots, []);

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

    class IoIosEye extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$17, create_fragment$17, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosEye",
    			options,
    			id: create_fragment$17.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosEyeOff.svelte generated by Svelte v3.48.0 */
    const file$11 = "node_modules\\svelte-icons\\io\\IoIosEyeOff.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$z(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M88.3 68.1c-5.6-5.5-14.6-5.5-20.1.1-5.5 5.5-5.5 14.5 0 20l355.5 355.7c3.7 3.7 9 4.9 13.7 3.6 2.4-.6 4.6-1.9 6.4-3.7 5.5-5.5 5.5-14.5 0-20L88.3 68.1zM260.2 345.9c-53 2.4-96.6-41.2-94.1-94.1.6-12.2 3.6-23.8 8.6-34.3L121.3 164c-27.7 21.4-55.4 48.9-85.1 81.3-5.5 6.1-5.6 15.2-.1 21.3C101 338.3 158.2 400 255.8 400c29.7 0 57.1-7.4 82.3-19.2l-43.5-43.5c-10.6 5-22.2 8-34.4 8.6zM475.8 266c5.3-5.8 5.6-14.6.5-20.7C424 181.8 351.5 112 255.8 112c-29.1 0-56 6.6-82 19l43.7 43.7c10.5-5 22.1-8.1 34.3-8.6 53-2.4 96.6 41.2 94.1 94.1-.6 12.2-3.6 23.8-8.6 34.3l53.5 53.5c33-25.3 61.3-55.9 85-82z");
    			add_location(path0, file$11, 4, 10, 153);
    			attr_dev(path1, "d", "M192.2 260.9c2.4 31.3 27.6 56.5 58.9 58.9 8.2.6 16.1-.3 23.4-2.6l-79.8-79.8c-2.2 7.4-3.1 15.3-2.5 23.5zM320 256c0-1.3-.1-2.6-.1-3.9-5.6 2.5-11.7 3.9-18.2 3.9-1.1 0-2.1 0-3.1-.1l18.6 18.7c1.8-5.9 2.8-12.2 2.8-18.6zM256 209c0-6 1.1-11.7 3.1-16.9-1 0-2-.1-3.1-.1-6.4 0-12.6 1-18.5 2.8l18.7 18.7c-.1-1.5-.2-3-.2-4.5z");
    			add_location(path1, file$11, 5, 0, 746);
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
    		id: create_default_slot$z.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$16(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$z] },
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
    		id: create_fragment$16.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$16($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosEyeOff', slots, []);

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

    class IoIosEyeOff extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$16, create_fragment$16, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosEyeOff",
    			options,
    			id: create_fragment$16.name
    		});
    	}
    }

    /* src\Components\PasswordInput.svelte generated by Svelte v3.48.0 */
    const file$10 = "src\\Components\\PasswordInput.svelte";

    // (25:0) {:else}
    function create_else_block$a(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", /*id*/ ctx[1]);
    			attr_dev(input, "class", "w3-card-2 inputs svelte-18ks43p");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			attr_dev(input, "type", "password");
    			input.required = true;
    			toggle_class(input, "error", /*error*/ ctx[2]);
    			add_location(input, file$10, 25, 1, 506);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*password*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[9]),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*password*/ 1 && input.value !== /*password*/ ctx[0]) {
    				set_input_value(input, /*password*/ ctx[0]);
    			}

    			if (dirty & /*error*/ 4) {
    				toggle_class(input, "error", /*error*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:0) {#if toggled}
    function create_if_block$h(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", /*id*/ ctx[1]);
    			attr_dev(input, "class", "w3-card-2 inputs svelte-18ks43p");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			attr_dev(input, "type", "text");
    			input.required = true;
    			toggle_class(input, "error", /*error*/ ctx[2]);
    			add_location(input, file$10, 14, 1, 351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*password*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(input, "input", /*input_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*password*/ 1 && input.value !== /*password*/ ctx[0]) {
    				set_input_value(input, /*password*/ ctx[0]);
    			}

    			if (dirty & /*error*/ 4) {
    				toggle_class(input, "error", /*error*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(14:0) {#if toggled}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$15(ctx) {
    	let t;
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*toggled*/ ctx[4]) return create_if_block$h;
    		return create_else_block$a;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	var switch_value = /*icon*/ ctx[5];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "toggle-password svelte-18ks43p");
    			add_location(div, file$10, 36, 0, 662);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}

    			if (switch_value !== (switch_value = /*icon*/ ctx[5])) {
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
    					mount_component(switch_instance, div, null);
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
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$15.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$15($$self, $$props, $$invalidate) {
    	let icon;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PasswordInput', slots, []);
    	let { password = '' } = $$props;
    	let { id = 'password' } = $$props;
    	let { error = false } = $$props;
    	let { placeholder = '' } = $$props;
    	let toggled = false;
    	const writable_props = ['password', 'id', 'error', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PasswordInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		password = this.value;
    		$$invalidate(0, password);
    	}

    	function input_input_handler_1() {
    		password = this.value;
    		$$invalidate(0, password);
    	}

    	const click_handler = () => $$invalidate(4, toggled = !toggled);

    	$$self.$$set = $$props => {
    		if ('password' in $$props) $$invalidate(0, password = $$props.password);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({
    		IoIosEye,
    		IoIosEyeOff,
    		password,
    		id,
    		error,
    		placeholder,
    		toggled,
    		icon
    	});

    	$$self.$inject_state = $$props => {
    		if ('password' in $$props) $$invalidate(0, password = $$props.password);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ('toggled' in $$props) $$invalidate(4, toggled = $$props.toggled);
    		if ('icon' in $$props) $$invalidate(5, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toggled*/ 16) {
    			$$invalidate(5, icon = toggled ? IoIosEyeOff : IoIosEye);
    		}
    	};

    	return [
    		password,
    		id,
    		error,
    		placeholder,
    		toggled,
    		icon,
    		input_handler,
    		input_handler_1,
    		input_input_handler,
    		input_input_handler_1,
    		click_handler
    	];
    }

    class PasswordInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$15, create_fragment$15, safe_not_equal, {
    			password: 0,
    			id: 1,
    			error: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PasswordInput",
    			options,
    			id: create_fragment$15.name
    		});
    	}

    	get password() {
    		throw new Error("<PasswordInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set password(value) {
    		throw new Error("<PasswordInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<PasswordInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PasswordInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<PasswordInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<PasswordInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<PasswordInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<PasswordInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const notifyError$1 = (message) => {
    	toastr.error(message, 'Fejl');
    };

    const notifySuccess = (message) => {
    	toastr.success(message);
    };

    const notifyInfo = (message) => {
    	toastr.info(message);
    };
    toastr.options = {
    	closeButton: false,
    	debug: false,
    	newestOnTop: true,
    	progressBar: true,
    	positionClass: 'toast-top-left',
    	preventDuplicates: true,
    	onclick: null,
    	showDuration: '300',
    	hideDuration: '1000',
    	timeOut: '5000',
    	extendedTimeOut: '1000',
    	showEasing: 'swing',
    	hideEasing: 'linear',
    	showMethod: 'fadeIn',
    	hideMethod: 'fadeOut',
    };

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + content);
        };
        return fileReader.readAsDataURL(data);
    };

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    const lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup$1[chars.charCodeAt(i)] = i;
    }
    const decode$1 = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const globalThisShim = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = setTimeout;
    const NATIVE_CLEAR_TIMEOUT = clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
        }
        else {
            obj.setTimeoutFn = setTimeout.bind(globalThisShim);
            obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
        }
    }
    // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
    const BASE64_OVERHEAD = 1.33;
    // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
    function byteLength(obj) {
        if (typeof obj === "string") {
            return utf8Length(obj);
        }
        // arraybuffer or blob
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                length += 1;
            }
            else if (c < 0x800) {
                length += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                length += 3;
            }
            else {
                i++;
                length += 4;
            }
        }
        return length;
    }

    class TransportError extends Error {
        constructor(reason, description, context) {
            super(reason);
            this.description = description;
            this.context = context;
            this.type = "TransportError";
        }
    }
    class Transport extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} options.
         * @api private
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.readyState = "";
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @api protected
         */
        onError(reason, description, context) {
            super.emitReserved("error", new TransportError(reason, description, context));
            return this;
        }
        /**
         * Opens the transport.
         *
         * @api public
         */
        open() {
            if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
            }
            return this;
        }
        /**
         * Closes the transport.
         *
         * @api public
         */
        close() {
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         * @api public
         */
        send(packets) {
            if ("open" === this.readyState) {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @api protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @api protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @api protected
         */
        onPacket(packet) {
            super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @api protected
         */
        onClose(details) {
            this.readyState = "closed";
            super.emitReserved("close", details);
        }
    }

    // imported from https://github.com/unshiftio/yeast
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
    let seed = 0, i = 0, prev;
    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
        let encoded = '';
        do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
        } while (num > 0);
        return encoded;
    }
    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
        const now = encode$1(+new Date());
        if (now !== prev)
            return seed = 0, prev = now;
        return now + '.' + encode$1(seed++);
    }
    //
    // Map each character to its index.
    //
    for (; i < length; i++)
        map[alphabet[i]] = i;

    // imported from https://github.com/galkn/querystring
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */
    function encode(obj) {
        let str = '';
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length)
                    str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }
        return str;
    }
    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */
    function decode(qs) {
        let qry = {};
        let pairs = qs.split('&');
        for (let i = 0, l = pairs.length; i < l; i++) {
            let pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    }

    // imported from https://github.com/component/has-cors
    let value = false;
    try {
        value = typeof XMLHttpRequest !== 'undefined' &&
            'withCredentials' in new XMLHttpRequest();
    }
    catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
    }
    const hasCORS = value;

    // browser shim for xmlhttprequest module
    function XHR(opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XHR({
            xdomain: false
        });
        return null != xhr.responseType;
    })();
    class Polling extends Transport {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.polling = false;
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        /**
         * Transport name.
         */
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @api private
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} callback upon buffers are flushed and transport is paused
         * @api private
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @api public
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @api private
         */
        onData(data) {
            const callback = packet => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose({ description: "transport closed by the server" });
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emitReserved("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @api private
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} data packets
         * @param {Function} drain callback
         * @api private
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, data => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emitReserved("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data
            });
            req.on("success", fn);
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr post error", xhrStatus, context);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @api private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr poll error", xhrStatus, context);
            });
            this.pollXhr = req;
        }
    }
    class Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XHR(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        }
        /**
         * Called upon error.
         *
         * @api private
         */
        onError(err) {
            this.emitReserved("error", err, this.xhr);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @api private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @api private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.emitReserved("data", data);
                this.emitReserved("success");
                this.cleanup();
            }
        }
        /**
         * Aborts the request.
         *
         * @api public
         */
        abort() {
            this.cleanup();
        }
    }
    Request.requestsCount = 0;
    Request.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return cb => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @api {Object} connection options
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Transport name.
         *
         * @api public
         */
        get name() {
            return "websocket";
        }
        /**
         * Opens socket.
         *
         * @api private
         */
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emitReserved("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @api private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = closeEvent => this.onClose({
                description: "websocket connection closed",
                context: closeEvent
            });
            this.ws.onmessage = ev => this.onData(ev.data);
            this.ws.onerror = e => this.onError("websocket error", e);
        }
        /**
         * Writes data to socket.
         *
         * @param {Array} array of packets.
         * @api private
         */
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, data => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        /**
         * Closes socket.
         *
         * @api private
         */
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @api public
         */
        check() {
            return !!WebSocket;
        }
    }

    const transports = {
        websocket: WS,
        polling: Polling
    };

    // imported from https://github.com/galkn/parseuri
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */
    const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];
    function parse(str) {
        const src = str, b = str.indexOf('['), e = str.indexOf(']');
        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }
        let m = re.exec(str || ''), uri = {}, i = 14;
        while (i--) {
            uri[parts[i]] = m[i] || '';
        }
        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);
        return uri;
    }
    function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.substr(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.substr(path.length - 1, 1) == '/') {
            names.splice(names.length - 1, 1);
        }
        return names;
    }
    function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });
        return data;
    }

    class Socket$1 extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} opts - options
         * @api public
         */
        constructor(uri, opts = {}) {
            super();
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parse(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parse(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024
                },
                transportOptions: {},
                closeOnBeforeunload: true
            }, opts);
            this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
            if (typeof this.opts.query === "string") {
                this.opts.query = decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    addEventListener("beforeunload", () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    }, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close", {
                            description: "network connection lost"
                        });
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */
        createTransport(name) {
            const query = Object.assign({}, this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", reason => this.onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", msg => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = err => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @api private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState &&
                this.opts.upgrade &&
                this.transport.pause) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @api private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @api private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.maxPayload = data.maxPayload;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @api private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @api private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @api private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                const packets = this.getWritablePackets();
                this.transport.send(packets);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = packets.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        getWritablePackets() {
            const shouldCheckPayloadSize = this.maxPayload &&
                this.transport.name === "polling" &&
                this.writeBuffer.length > 1;
            if (!shouldCheckPayloadSize) {
                return this.writeBuffer;
            }
            let payloadSize = 1; // first packet type
            for (let i = 0; i < this.writeBuffer.length; i++) {
                const data = this.writeBuffer[i].data;
                if (data) {
                    payloadSize += byteLength(data);
                }
                if (i > 0 && payloadSize > this.maxPayload) {
                    return this.writeBuffer.slice(0, i);
                }
                payloadSize += 2; // separator + packet type
            }
            return this.writeBuffer;
        }
        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @param {Object} options.
         * @return {Socket} for chaining.
         * @api public
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} callback function.
         * @api private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         *
         * @api public
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @api private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @api private
         */
        onClose(reason, description) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, description);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parse(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        packet.attachments = undefined; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
            this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    obj.type =
                        obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK;
                    return this.encodeAsBinary(obj);
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data, this.replacer);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
            super();
            this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                packet = this.decodeString(obj);
                if (packet.type === PacketType.BINARY_EVENT ||
                    packet.type === PacketType.BINARY_ACK) {
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = this.tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        tryParse(str) {
            try {
                return JSON.parse(str, this.reviver);
            }
            catch (e) {
                return false;
            }
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
            }
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    class Socket extends Emitter {
        /**
         * `Socket` constructor.
         *
         * @public
         */
        constructor(io, nsp, opts) {
            super();
            this.connected = false;
            this.receiveBuffer = [];
            this.sendBuffer = [];
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Whether the socket is currently disconnected
         */
        get disconnected() {
            return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @public
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for connect()
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * @return self
         * @public
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @return self
         * @public
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev + '" is a reserved event name');
            }
            args.unshift(ev);
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            const timeout = this.flags.timeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this.packet({ type: PacketType.CONNECT, data });
                });
            }
            else {
                this.packet({ type: PacketType.CONNECT, data: this.auth });
            }
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
            this.connected = false;
            delete this.id;
            this.emitReserved("disconnect", reason, description);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id) {
            this.id = id;
            this.connected = true;
            this.emitBuffered();
            this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            });
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually.
         *
         * @return self
         * @public
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for disconnect()
         *
         * @return self
         * @public
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         * @public
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @returns self
         * @public
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * ```
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         * ```
         *
         * @returns self
         * @public
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @param listener
         * @public
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @param listener
         * @public
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @param listener
         * @public
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         *
         * @public
         */
        listenersAny() {
            return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @param listener
         *
         * <pre><code>
         *
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(event);
         * });
         *
         * </pre></code>
         *
         * @public
         */
        onAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @param listener
         *
         * <pre><code>
         *
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(event);
         * });
         *
         * </pre></code>
         *
         * @public
         */
        prependAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @param listener
         *
         * <pre><code>
         *
         * const handler = (event, ...args) => {
         *   console.log(event);
         * }
         *
         * socket.onAnyOutgoing(handler);
         *
         * // then later
         * socket.offAnyOutgoing(handler);
         *
         * </pre></code>
         *
         * @public
         */
        offAnyOutgoing(listener) {
            if (!this._anyOutgoingListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyOutgoingListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyOutgoingListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         *
         * @public
         */
        listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
            if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
                const listeners = this._anyOutgoingListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, packet.data);
                }
            }
        }
    }

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */
    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }
    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */
    Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };
    /**
     * Reset the number of attempts.
     *
     * @api public
     */
    Backoff.prototype.reset = function () {
        this.attempts = 0;
    };
    /**
     * Set the minimum duration
     *
     * @api public
     */
    Backoff.prototype.setMin = function (min) {
        this.ms = min;
    };
    /**
     * Set the maximum duration
     *
     * @api public
     */
    Backoff.prototype.setMax = function (max) {
        this.max = max;
    };
    /**
     * Set the jitter
     *
     * @api public
     */
    Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
    };

    class Manager extends Emitter {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            this.decoder.add(data);
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            this.emitReserved("packet", packet);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason, description) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason, description);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    const socket = lookup();

    socket.on('connect', () => {});
    socket.on('connect_error', () => {
    	socket.connect();
    });

    socket.emit('login', { id: sessionStorage.getItem('userId') });
    const CONNECT = () => {
    	socket.connect();

    	socket.emit('login', { id: null });
    };
    const DISCONNECT = () => {
    	socket.emit('logout');
    	socket.disconnect();
    };

    const joined = (fn) => {
    	socket.removeListener('joined');
    	socket.on('joined', ({ data }) => {
    		fn(data);
    	});
    };
    const left = (fn) => {
    	socket.removeListener('loggedOut');
    	socket.on('loggedOut', ({ data }) => {
    		fn(data);
    	});
    };

    /* src\Public\Login.svelte generated by Svelte v3.48.0 */
    const file$$ = "src\\Public\\Login.svelte";

    // (49:0) {:else}
    function create_else_block$9(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div2;
    	let form;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let label1;
    	let t8;
    	let passwordinput;
    	let updating_password;
    	let t9;
    	let input1;
    	let t10;
    	let div3;
    	let p1;
    	let t11;
    	let span;
    	let a;
    	let current;
    	let mounted;
    	let dispose;

    	function passwordinput_password_binding(value) {
    		/*passwordinput_password_binding*/ ctx[5](value);
    	}

    	let passwordinput_props = {};

    	if (/*password*/ ctx[2] !== void 0) {
    		passwordinput_props.password = /*password*/ ctx[2];
    	}

    	passwordinput = new PasswordInput({
    			props: passwordinput_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(passwordinput, 'password', passwordinput_password_binding));

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Velkommen Tilbage";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Login og planlæg din vagtplan nemt og hutigt!";
    			t3 = space();
    			div2 = element("div");
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Brugernavn*";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Adgangskode*";
    			t8 = space();
    			create_component(passwordinput.$$.fragment);
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t11 = text("Har du ikke en bruger?\r\n\t\t\t\t");
    			span = element("span");
    			a = element("a");
    			a.textContent = "Registrer din Virksomhed her";
    			attr_dev(h1, "class", "text");
    			add_location(h1, file$$, 52, 4, 1325);
    			attr_dev(p0, "class", "intro-text text");
    			add_location(p0, file$$, 53, 4, 1370);
    			attr_dev(div0, "class", "intro");
    			add_location(div0, file$$, 51, 3, 1300);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$$, 50, 2, 1274);
    			attr_dev(label0, "for", "email");
    			add_location(label0, file$$, 58, 4, 1542);
    			attr_dev(input0, "class", "w3-card-2 inputs");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "name", "email");
    			input0.required = true;
    			add_location(input0, file$$, 59, 4, 1587);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$$, 67, 4, 1716);
    			attr_dev(input1, "type", "submit");
    			input1.value = "Login";
    			attr_dev(input1, "class", "w3-button w3-round-small w3-hover-black w3-left-align");
    			set_style(input1, "height", `45px`, false);
    			set_style(input1, "margin-top", `35px`, false);
    			add_location(input1, file$$, 69, 4, 1802);
    			add_location(form, file$$, 57, 3, 1497);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file$$, 56, 2, 1471);
    			attr_dev(a, "href", "/signup");
    			add_location(a, file$$, 81, 11, 2095);
    			add_location(span, file$$, 81, 4, 2088);
    			attr_dev(p1, "class", "w3-section");
    			add_location(p1, file$$, 79, 3, 2032);
    			attr_dev(div3, "class", "content");
    			add_location(div3, file$$, 78, 2, 2006);
    			attr_dev(div4, "class", "container w3-animate-zoom");
    			add_location(div4, file$$, 49, 1, 1231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, form);
    			append_dev(form, label0);
    			append_dev(form, t5);
    			append_dev(form, input0);
    			set_input_value(input0, /*email*/ ctx[1]);
    			append_dev(form, t6);
    			append_dev(form, label1);
    			append_dev(form, t8);
    			mount_component(passwordinput, form, null);
    			append_dev(form, t9);
    			append_dev(form, input1);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t11);
    			append_dev(p1, span);
    			append_dev(span, a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(form, "submit", prevent_default(/*login*/ ctx[3]), false, true, false),
    					action_destroyer(link.call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*email*/ 2 && input0.value !== /*email*/ ctx[1]) {
    				set_input_value(input0, /*email*/ ctx[1]);
    			}

    			const passwordinput_changes = {};

    			if (!updating_password && dirty & /*password*/ 4) {
    				updating_password = true;
    				passwordinput_changes.password = /*password*/ ctx[2];
    				add_flush_callback(() => updating_password = false);
    			}

    			passwordinput.$set(passwordinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(passwordinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(passwordinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(passwordinput);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:0) {#if isLoading}
    function create_if_block$g(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ props: { type: 'Plane' }, $$inline: true });

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
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(47:0) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$14(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
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
    		id: create_fragment$14.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$14($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let isLoading = false;
    	let email = '1505samirali@gmail.com';
    	let password = '123456789';

    	async function login() {
    		$$invalidate(0, isLoading = true);
    		const { payload, error } = await authPost(SIGNIN(), { email, password });

    		if (payload) {
    			set_store_value(user, $user = payload.user, $user);
    			CONNECT();
    			sessionStorage.setItem('userId', $user._id);
    			sessionStorage.removeItem('lastVisited');
    			const theme = localStorage.getItem($user._id);

    			if (theme) {
    				localStorage.setItem('savedTheme', theme);
    			} else {
    				localStorage.removeItem('savedTheme');
    			}

    			notifySuccess(`Velkommen, ${$user.firstname} ${$user.lastname}`);
    		} else {
    			notifyError$1(error.message);
    		}

    		$$invalidate(0, isLoading = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(1, email);
    	}

    	function passwordinput_password_binding(value) {
    		password = value;
    		$$invalidate(2, password);
    	}

    	$$self.$capture_state = () => ({
    		link,
    		Loader,
    		PasswordInput,
    		user,
    		notifyError: notifyError$1,
    		notifySuccess,
    		authPost,
    		SIGNIN,
    		CONNECT,
    		isLoading,
    		email,
    		password,
    		login,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isLoading,
    		email,
    		password,
    		login,
    		input0_input_handler,
    		passwordinput_password_binding
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$14, create_fragment$14, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$14.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiArrowBackOutline.svelte generated by Svelte v3.48.0 */
    const file$_ = "node_modules\\svelte-icons\\ti\\TiArrowBackOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$y(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484v1.437c0 .534-.208 1.036-.586 1.414-.756.756-2.077.751-2.823.005l-6.293-6.207c-.191-.189-.298-.444-.298-.713s.107-.524.298-.712l6.288-6.203c.754-.755 2.073-.756 2.829.001.377.378.585.88.585 1.414v1.704c4.619.933 8 4.997 8 9.796v1c0 .442-.29.832-.714.958-.095.027-.19.042-.286.042-.331 0-.646-.165-.836-.452zm-7.141-5.536c2.207.056 4.638.394 6.758 2.121-.768-3.216-3.477-5.702-6.893-6.08-.504-.056-.888-.052-.888-.052v-3.497l-5.576 5.496 5.576 5.5v-3.499l1.023.011z");
    			add_location(path, file$_, 4, 10, 151);
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
    		id: create_default_slot$y.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$13(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$y] },
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
    		id: create_fragment$13.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$13($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$13, create_fragment$13, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiArrowBackOutline",
    			options,
    			id: create_fragment$13.name
    		});
    	}
    }

    /* src\Public\Signup\Intro.svelte generated by Svelte v3.48.0 */
    const file$Z = "src\\Public\\Signup\\Intro.svelte";

    function create_fragment$12(ctx) {
    	let div0;
    	let tiarrowbackoutline;
    	let t0;
    	let div6;
    	let div1;
    	let h2;
    	let t2;
    	let p;
    	let t4;
    	let div4;
    	let div2;
    	let b0;
    	let t6;
    	let small0;
    	let t8;
    	let div3;
    	let b1;
    	let t10;
    	let small1;
    	let t12;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;
    	tiarrowbackoutline = new TiArrowBackOutline({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(tiarrowbackoutline.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Hej!";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Hvad er du her for at lave i dag?";
    			t4 = space();
    			div4 = element("div");
    			div2 = element("div");
    			b0 = element("b");
    			b0.textContent = "Oprette en ny bruger";
    			t6 = space();
    			small0 = element("small");
    			small0.textContent = "Jeg vil gerne se om Weeki er noget for min virksomhed";
    			t8 = space();
    			div3 = element("div");
    			b1 = element("b");
    			b1.textContent = "Slutte mig til mine kollegaer";
    			t10 = space();
    			small1 = element("small");
    			small1.textContent = "Jeg vil gerne finde mit hold og se min vagtplan";
    			t12 = space();
    			div5 = element("div");
    			attr_dev(div0, "class", "back svelte-ljlgqp");
    			add_location(div0, file$Z, 5, 0, 148);
    			attr_dev(h2, "class", "text");
    			add_location(h2, file$Z, 10, 2, 296);
    			attr_dev(p, "class", "text");
    			add_location(p, file$Z, 11, 2, 326);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file$Z, 9, 1, 273);
    			attr_dev(b0, "class", "bold-text");
    			add_location(b0, file$Z, 18, 3, 512);
    			attr_dev(small0, "class", "bold-text");
    			add_location(small0, file$Z, 19, 3, 562);
    			attr_dev(div2, "class", "w3-card-2 w3-panel w3-hover-blue card");
    			add_location(div2, file$Z, 14, 2, 400);
    			attr_dev(b1, "class", "bold-text");
    			add_location(b1, file$Z, 27, 3, 783);
    			attr_dev(small1, "class", "bold-text");
    			add_location(small1, file$Z, 28, 3, 842);
    			attr_dev(div3, "class", "w3-card-2 w3-panel w3-hover-blue card");
    			add_location(div3, file$Z, 23, 2, 673);
    			add_location(div4, file$Z, 13, 1, 391);
    			add_location(div5, file$Z, 33, 1, 955);
    			attr_dev(div6, "class", "content w3-animate-bottom");
    			add_location(div6, file$Z, 8, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(tiarrowbackoutline, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(div6, t4);
    			append_dev(div6, div4);
    			append_dev(div4, div2);
    			append_dev(div2, b0);
    			append_dev(div2, t6);
    			append_dev(div2, small0);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, b1);
    			append_dev(div3, t10);
    			append_dev(div3, small1);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[0], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(div3, "click", /*click_handler_2*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tiarrowbackoutline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tiarrowbackoutline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(tiarrowbackoutline);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$12.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$12($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => navigate(-1);
    	const click_handler_1 = () => navigate('/signup/create');
    	const click_handler_2 = () => navigate('/signup/join');
    	$$self.$capture_state = () => ({ navigate, TiArrowBackOutline });
    	return [click_handler, click_handler_1, click_handler_2];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$12, create_fragment$12, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$12.name
    		});
    	}
    }

    /* src\Public\Signup\create\RegisterAuthentication.svelte generated by Svelte v3.48.0 */
    const file$Y = "src\\Public\\Signup\\create\\RegisterAuthentication.svelte";

    function create_fragment$11(ctx) {
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
    	let t7;
    	let passwordinput0;
    	let updating_password;
    	let t8;
    	let label2;
    	let t10;
    	let passwordinput1;
    	let updating_password_1;
    	let t11;
    	let label3;
    	let input1;
    	let t12;
    	let a0;
    	let t14;
    	let a1;
    	let t16;
    	let input2;
    	let input2_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	function passwordinput0_password_binding(value) {
    		/*passwordinput0_password_binding*/ ctx[9](value);
    	}

    	let passwordinput0_props = { error: false };

    	if (/*password*/ ctx[1] !== void 0) {
    		passwordinput0_props.password = /*password*/ ctx[1];
    	}

    	passwordinput0 = new PasswordInput({
    			props: passwordinput0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(passwordinput0, 'password', passwordinput0_password_binding));
    	passwordinput0.$on("input", /*checkMatch*/ ctx[5]);

    	function passwordinput1_password_binding(value) {
    		/*passwordinput1_password_binding*/ ctx[10](value);
    	}

    	let passwordinput1_props = {
    		id: "re-password",
    		error: !/*match*/ ctx[3]
    	};

    	if (/*rePass*/ ctx[2] !== void 0) {
    		passwordinput1_props.password = /*rePass*/ ctx[2];
    	}

    	passwordinput1 = new PasswordInput({
    			props: passwordinput1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(passwordinput1, 'password', passwordinput1_password_binding));
    	passwordinput1.$on("input", /*checkMatch*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Opret en ny bruger";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Først har vi brug for din login oplysninger";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			t4 = text("E-mail*\r\n\t\t\t");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Adgangskode*";
    			t7 = space();
    			create_component(passwordinput0.$$.fragment);
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Bekræft Adgangskode*";
    			t10 = space();
    			create_component(passwordinput1.$$.fragment);
    			t11 = space();
    			label3 = element("label");
    			input1 = element("input");
    			t12 = text("\r\n\t\t\tJeg acceptere\r\n\t\t\t");
    			a0 = element("a");
    			a0.textContent = "vilkårene og betingelserne";
    			t14 = text("\r\n\t\t\tog\r\n\t\t\t");
    			a1 = element("a");
    			a1.textContent = "Fortrolighedspolitik";
    			t16 = space();
    			input2 = element("input");
    			add_location(h2, file$Y, 28, 2, 583);
    			add_location(p, file$Y, 29, 2, 614);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$Y, 27, 1, 560);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "class", "w3-card-2 inputs");
    			input0.required = true;
    			add_location(input0, file$Y, 37, 3, 811);
    			add_location(label0, file$Y, 35, 2, 787);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$Y, 39, 2, 902);
    			attr_dev(label2, "for", "re-password");
    			add_location(label2, file$Y, 42, 2, 1021);
    			attr_dev(input1, "type", "checkbox");
    			input1.required = true;
    			add_location(input1, file$Y, 50, 3, 1207);
    			attr_dev(a0, "href", "/terms/Terms&Conditions.html");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$Y, 52, 3, 1277);
    			attr_dev(a1, "href", "/terms/PrivacyPolicy.html");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$Y, 56, 3, 1385);
    			add_location(label3, file$Y, 49, 2, 1195);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Næste Trin";
    			attr_dev(input2, "class", "w3-button w3-left-align button inputs");
    			input2.disabled = input2_disabled_value = !/*match*/ ctx[3] || !/*checked*/ ctx[4];
    			add_location(input2, file$Y, 58, 2, 1477);
    			add_location(form, file$Y, 31, 1, 676);
    			attr_dev(div1, "class", "w3-animate-bottom");
    			add_location(div1, file$Y, 26, 0, 526);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			mount_component(passwordinput0, form, null);
    			append_dev(form, t8);
    			append_dev(form, label2);
    			append_dev(form, t10);
    			mount_component(passwordinput1, form, null);
    			append_dev(form, t11);
    			append_dev(form, label3);
    			append_dev(label3, input1);
    			input1.checked = /*checked*/ ctx[4];
    			append_dev(label3, t12);
    			append_dev(label3, a0);
    			append_dev(label3, t14);
    			append_dev(label3, a1);
    			append_dev(form, t16);
    			append_dev(form, input2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[11]),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			const passwordinput0_changes = {};

    			if (!updating_password && dirty & /*password*/ 2) {
    				updating_password = true;
    				passwordinput0_changes.password = /*password*/ ctx[1];
    				add_flush_callback(() => updating_password = false);
    			}

    			passwordinput0.$set(passwordinput0_changes);
    			const passwordinput1_changes = {};
    			if (dirty & /*match*/ 8) passwordinput1_changes.error = !/*match*/ ctx[3];

    			if (!updating_password_1 && dirty & /*rePass*/ 4) {
    				updating_password_1 = true;
    				passwordinput1_changes.password = /*rePass*/ ctx[2];
    				add_flush_callback(() => updating_password_1 = false);
    			}

    			passwordinput1.$set(passwordinput1_changes);

    			if (dirty & /*checked*/ 16) {
    				input1.checked = /*checked*/ ctx[4];
    			}

    			if (!current || dirty & /*match, checked*/ 24 && input2_disabled_value !== (input2_disabled_value = !/*match*/ ctx[3] || !/*checked*/ ctx[4])) {
    				prop_dev(input2, "disabled", input2_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(passwordinput0.$$.fragment, local);
    			transition_in(passwordinput1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(passwordinput0.$$.fragment, local);
    			transition_out(passwordinput1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(passwordinput0);
    			destroy_component(passwordinput1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$11.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$11($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterAuthentication', slots, []);
    	let email = 'samirali@live.dk';
    	let password = '123456789';
    	let rePass = '123456789';
    	let match = true;
    	let checked = false;
    	let { onSubmit } = $$props;

    	function checkMatch() {
    		if (rePass.length > 0) {
    			if (password !== rePass) {
    				$$invalidate(3, match = false);
    			} else {
    				$$invalidate(3, match = true);
    			}
    		}
    	}

    	function submit() {
    		onSubmit({ email, password });
    	}

    	const writable_props = ['onSubmit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterAuthentication> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function passwordinput0_password_binding(value) {
    		password = value;
    		$$invalidate(1, password);
    	}

    	function passwordinput1_password_binding(value) {
    		rePass = value;
    		$$invalidate(2, rePass);
    	}

    	function input1_change_handler() {
    		checked = this.checked;
    		$$invalidate(4, checked);
    	}

    	const submit_handler = () => match
    	? submit()
    	: notifyError$1('Adganskode matcher ikke');

    	$$self.$$set = $$props => {
    		if ('onSubmit' in $$props) $$invalidate(7, onSubmit = $$props.onSubmit);
    	};

    	$$self.$capture_state = () => ({
    		PasswordInput,
    		notifyError: notifyError$1,
    		email,
    		password,
    		rePass,
    		match,
    		checked,
    		onSubmit,
    		checkMatch,
    		submit
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('rePass' in $$props) $$invalidate(2, rePass = $$props.rePass);
    		if ('match' in $$props) $$invalidate(3, match = $$props.match);
    		if ('checked' in $$props) $$invalidate(4, checked = $$props.checked);
    		if ('onSubmit' in $$props) $$invalidate(7, onSubmit = $$props.onSubmit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		email,
    		password,
    		rePass,
    		match,
    		checked,
    		checkMatch,
    		submit,
    		onSubmit,
    		input0_input_handler,
    		passwordinput0_password_binding,
    		passwordinput1_password_binding,
    		input1_change_handler,
    		submit_handler
    	];
    }

    class RegisterAuthentication$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$11, create_fragment$11, safe_not_equal, { onSubmit: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterAuthentication",
    			options,
    			id: create_fragment$11.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onSubmit*/ ctx[7] === undefined && !('onSubmit' in props)) {
    			console.warn("<RegisterAuthentication> was created without expected prop 'onSubmit'");
    		}
    	}

    	get onSubmit() {
    		throw new Error("<RegisterAuthentication>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<RegisterAuthentication>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\create\RegisterUser.svelte generated by Svelte v3.48.0 */

    const file$X = "src\\Public\\Signup\\create\\RegisterUser.svelte";

    function create_fragment$10(ctx) {
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
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let input4;
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
    			p.textContent = "Nu har vi brug for dine personlige oplysninger";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			t4 = text("Fornavn*\r\n\t\t\t");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			t6 = text("Efternavn*\r\n\t\t\t");
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			t8 = text("Mobil nummer\r\n\t\t\t");
    			input2 = element("input");
    			t9 = space();
    			label3 = element("label");
    			t10 = text("Profil billede\r\n\t\t\t");
    			input3 = element("input");
    			t11 = space();
    			input4 = element("input");
    			add_location(h2, file$X, 18, 2, 345);
    			add_location(p, file$X, 19, 2, 376);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$X, 17, 1, 322);
    			attr_dev(input0, "class", "w3-card-2 inputs");
    			attr_dev(input0, "placeholder", "Fornavn");
    			input0.required = true;
    			add_location(input0, file$X, 24, 3, 510);
    			add_location(label0, file$X, 22, 2, 485);
    			attr_dev(input1, "class", "w3-card-2 inputs");
    			attr_dev(input1, "placeholder", "Efternavn");
    			input1.required = true;
    			add_location(input1, file$X, 33, 3, 672);
    			add_location(label1, file$X, 31, 2, 645);
    			attr_dev(input2, "class", "w3-card-2 inputs");
    			attr_dev(input2, "placeholder", "Mobil nummer");
    			add_location(input2, file$X, 42, 3, 837);
    			add_location(label2, file$X, 40, 2, 808);
    			attr_dev(input3, "class", "w3-card-2 inputs");
    			attr_dev(input3, "placeholder", "link til et profil billede");
    			add_location(input3, file$X, 50, 3, 990);
    			add_location(label3, file$X, 48, 2, 959);
    			attr_dev(input4, "type", "submit");
    			input4.value = "Næste Trin";
    			attr_dev(input4, "class", "w3-button w3-left-align button inputs");
    			add_location(input4, file$X, 56, 2, 1123);
    			add_location(form, file$X, 21, 1, 441);
    			attr_dev(div1, "class", "w3-animate-bottom");
    			add_location(div1, file$X, 16, 0, 288);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    			set_input_value(input0, /*detail*/ ctx[0].firstname);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(label1, t6);
    			append_dev(label1, input1);
    			set_input_value(input1, /*detail*/ ctx[0].lastname);
    			append_dev(form, t7);
    			append_dev(form, label2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*detail*/ ctx[0].phone);
    			append_dev(form, t9);
    			append_dev(form, label3);
    			append_dev(label3, t10);
    			append_dev(label3, input3);
    			set_input_value(input3, /*detail*/ ctx[0].pb);
    			append_dev(form, t11);
    			append_dev(form, input4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*detail*/ 1 && input0.value !== /*detail*/ ctx[0].firstname) {
    				set_input_value(input0, /*detail*/ ctx[0].firstname);
    			}

    			if (dirty & /*detail*/ 1 && input1.value !== /*detail*/ ctx[0].lastname) {
    				set_input_value(input1, /*detail*/ ctx[0].lastname);
    			}

    			if (dirty & /*detail*/ 1 && input2.value !== /*detail*/ ctx[0].phone) {
    				set_input_value(input2, /*detail*/ ctx[0].phone);
    			}

    			if (dirty & /*detail*/ 1 && input3.value !== /*detail*/ ctx[0].pb) {
    				set_input_value(input3, /*detail*/ ctx[0].pb);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$10.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$10($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterUser', slots, []);
    	let { onSubmit } = $$props;

    	let detail = {
    		firstname: 'Malik',
    		lastname: 'Mayo',
    		phone: '25323150',
    		pb: 'https://i.pinimg.com/originals/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg',
    		admin: true
    	};

    	function submit() {
    		onSubmit(detail);
    	}

    	const writable_props = ['onSubmit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterUser> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		detail.firstname = this.value;
    		$$invalidate(0, detail);
    	}

    	function input1_input_handler() {
    		detail.lastname = this.value;
    		$$invalidate(0, detail);
    	}

    	function input2_input_handler() {
    		detail.phone = this.value;
    		$$invalidate(0, detail);
    	}

    	function input3_input_handler() {
    		detail.pb = this.value;
    		$$invalidate(0, detail);
    	}

    	$$self.$$set = $$props => {
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    	};

    	$$self.$capture_state = () => ({ onSubmit, detail, submit });

    	$$self.$inject_state = $$props => {
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    		if ('detail' in $$props) $$invalidate(0, detail = $$props.detail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		detail,
    		submit,
    		onSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class RegisterUser$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$10, create_fragment$10, safe_not_equal, { onSubmit: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterUser",
    			options,
    			id: create_fragment$10.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onSubmit*/ ctx[2] === undefined && !('onSubmit' in props)) {
    			console.warn("<RegisterUser> was created without expected prop 'onSubmit'");
    		}
    	}

    	get onSubmit() {
    		throw new Error("<RegisterUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<RegisterUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\create\RegisterCompany.svelte generated by Svelte v3.48.0 */

    const file$W = "src\\Public\\Signup\\create\\RegisterCompany.svelte";

    function create_fragment$$(ctx) {
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
    			t4 = text("Virksomhed*\r\n\t\t\t");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			t6 = text("CVR*\r\n\t\t\t");
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			t8 = text("Telefon nummer*\r\n\t\t\t");
    			input2 = element("input");
    			t9 = space();
    			input3 = element("input");
    			add_location(h2, file$W, 16, 2, 247);
    			add_location(p, file$W, 17, 2, 284);
    			attr_dev(div0, "class", "w3-section");
    			add_location(div0, file$W, 15, 1, 219);
    			input0.required = true;
    			attr_dev(input0, "class", "w3-card-2 inputs");
    			add_location(input0, file$W, 22, 3, 442);
    			add_location(label0, file$W, 20, 2, 414);
    			attr_dev(input1, "type", "number");
    			input1.required = true;
    			attr_dev(input1, "class", "w3-card-2 inputs");
    			add_location(input1, file$W, 26, 3, 548);
    			add_location(label1, file$W, 24, 2, 527);
    			attr_dev(input2, "type", "tel");
    			input2.required = true;
    			attr_dev(input2, "class", "w3-card-2 inputs");
    			add_location(input2, file$W, 35, 3, 702);
    			add_location(label2, file$W, 33, 2, 670);
    			attr_dev(input3, "type", "submit");
    			input3.value = "Opret";
    			attr_dev(input3, "class", "w3-button w3-left-align button");
    			add_location(input3, file$W, 42, 2, 823);
    			add_location(form, file$W, 19, 1, 370);
    			attr_dev(div1, "class", "w3-animate-bottom");
    			add_location(div1, file$W, 14, 0, 185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    			set_input_value(input0, /*company*/ ctx[0].name);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(label1, t6);
    			append_dev(label1, input1);
    			set_input_value(input1, /*company*/ ctx[0].cvr);
    			append_dev(form, t7);
    			append_dev(form, label2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*company*/ ctx[0].phone);
    			append_dev(form, t9);
    			append_dev(form, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*company*/ 1 && input0.value !== /*company*/ ctx[0].name) {
    				set_input_value(input0, /*company*/ ctx[0].name);
    			}

    			if (dirty & /*company*/ 1 && to_number(input1.value) !== /*company*/ ctx[0].cvr) {
    				set_input_value(input1, /*company*/ ctx[0].cvr);
    			}

    			if (dirty & /*company*/ 1) {
    				set_input_value(input2, /*company*/ ctx[0].phone);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$$.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$$($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterCompany', slots, []);
    	let { onSubmit } = $$props;

    	let company = {
    		name: 'MinVirk',
    		cvr: 45687431541,
    		phone: '421545651'
    	};

    	function submit() {
    		onSubmit(company);
    	}

    	const writable_props = ['onSubmit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterCompany> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		company.name = this.value;
    		$$invalidate(0, company);
    	}

    	function input1_input_handler() {
    		company.cvr = to_number(this.value);
    		$$invalidate(0, company);
    	}

    	function input2_input_handler() {
    		company.phone = this.value;
    		$$invalidate(0, company);
    	}

    	$$self.$$set = $$props => {
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    	};

    	$$self.$capture_state = () => ({ onSubmit, company, submit });

    	$$self.$inject_state = $$props => {
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    		if ('company' in $$props) $$invalidate(0, company = $$props.company);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		company,
    		submit,
    		onSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class RegisterCompany extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$$, create_fragment$$, safe_not_equal, { onSubmit: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterCompany",
    			options,
    			id: create_fragment$$.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onSubmit*/ ctx[2] === undefined && !('onSubmit' in props)) {
    			console.warn("<RegisterCompany> was created without expected prop 'onSubmit'");
    		}
    	}

    	get onSubmit() {
    		throw new Error("<RegisterCompany>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<RegisterCompany>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\Create.svelte generated by Svelte v3.48.0 */
    const file$V = "src\\Public\\Signup\\Create.svelte";

    // (18:22) 
    function create_if_block_2$5(ctx) {
    	let detail;
    	let current;

    	detail = new RegisterUser$1({
    			props: { onSubmit: /*registerUser*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(detail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(detail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const detail_changes = {};
    			if (dirty & /*registerUser*/ 1) detail_changes.onSubmit = /*registerUser*/ ctx[0];
    			detail.$set(detail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(detail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(detail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(detail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(18:22) ",
    		ctx
    	});

    	return block;
    }

    // (16:22) 
    function create_if_block_1$a(ctx) {
    	let company;
    	let current;

    	company = new RegisterCompany({
    			props: { onSubmit: /*registerCompany*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(company.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(company, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const company_changes = {};
    			if (dirty & /*registerCompany*/ 2) company_changes.onSubmit = /*registerCompany*/ ctx[1];
    			company.$set(company_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(company.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(company.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(company, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(16:22) ",
    		ctx
    	});

    	return block;
    }

    // (14:1) {#if step === 0}
    function create_if_block$f(ctx) {
    	let authentication;
    	let current;

    	authentication = new RegisterAuthentication$1({
    			props: {
    				onSubmit: /*registerAuthentication*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(authentication.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authentication, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const authentication_changes = {};
    			if (dirty & /*registerAuthentication*/ 4) authentication_changes.onSubmit = /*registerAuthentication*/ ctx[2];
    			authentication.$set(authentication_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authentication.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authentication.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authentication, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(14:1) {#if step === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$_(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$f, create_if_block_1$a, create_if_block_2$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*step*/ ctx[3] === 0) return 0;
    		if (/*step*/ ctx[3] === 1) return 1;
    		if (/*step*/ ctx[3] === 2) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "content parent svelte-179os3x");
    			add_location(div, file$V, 12, 0, 321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
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
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$_.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$_($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create', slots, []);
    	let { registerUser } = $$props;
    	let { registerCompany } = $$props;
    	let { registerAuthentication } = $$props;
    	let { step } = $$props;
    	const writable_props = ['registerUser', 'registerCompany', 'registerAuthentication', 'step'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('registerUser' in $$props) $$invalidate(0, registerUser = $$props.registerUser);
    		if ('registerCompany' in $$props) $$invalidate(1, registerCompany = $$props.registerCompany);
    		if ('registerAuthentication' in $$props) $$invalidate(2, registerAuthentication = $$props.registerAuthentication);
    		if ('step' in $$props) $$invalidate(3, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({
    		Authentication: RegisterAuthentication$1,
    		Detail: RegisterUser$1,
    		Company: RegisterCompany,
    		registerUser,
    		registerCompany,
    		registerAuthentication,
    		step
    	});

    	$$self.$inject_state = $$props => {
    		if ('registerUser' in $$props) $$invalidate(0, registerUser = $$props.registerUser);
    		if ('registerCompany' in $$props) $$invalidate(1, registerCompany = $$props.registerCompany);
    		if ('registerAuthentication' in $$props) $$invalidate(2, registerAuthentication = $$props.registerAuthentication);
    		if ('step' in $$props) $$invalidate(3, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [registerUser, registerCompany, registerAuthentication, step];
    }

    class Create extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$_, create_fragment$_, safe_not_equal, {
    			registerUser: 0,
    			registerCompany: 1,
    			registerAuthentication: 2,
    			step: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create",
    			options,
    			id: create_fragment$_.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*registerUser*/ ctx[0] === undefined && !('registerUser' in props)) {
    			console.warn("<Create> was created without expected prop 'registerUser'");
    		}

    		if (/*registerCompany*/ ctx[1] === undefined && !('registerCompany' in props)) {
    			console.warn("<Create> was created without expected prop 'registerCompany'");
    		}

    		if (/*registerAuthentication*/ ctx[2] === undefined && !('registerAuthentication' in props)) {
    			console.warn("<Create> was created without expected prop 'registerAuthentication'");
    		}

    		if (/*step*/ ctx[3] === undefined && !('step' in props)) {
    			console.warn("<Create> was created without expected prop 'step'");
    		}
    	}

    	get registerUser() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerUser(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerCompany() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerCompany(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerAuthentication() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerAuthentication(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Create>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Create>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\join\ValidateToken.svelte generated by Svelte v3.48.0 */

    const file$U = "src\\Public\\Signup\\join\\ValidateToken.svelte";

    function create_fragment$Z(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let form;
    	let input0;
    	let t4;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Slut dig til dine kollegaer";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Vi skal først bruge din invitations Token";
    			t3 = space();
    			form = element("form");
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			add_location(h2, file$U, 6, 1, 83);
    			add_location(p, file$U, 7, 1, 122);
    			attr_dev(div, "class", "title");
    			add_location(div, file$U, 5, 0, 61);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "token");
    			add_location(input0, file$U, 10, 1, 240);
    			attr_dev(input1, "type", "submit");
    			input1.value = "Næste trin";
    			attr_dev(input1, "class", "w3-button w3-left-align w3-blue w3-hover-black");
    			add_location(input1, file$U, 11, 1, 296);
    			add_location(form, file$U, 9, 0, 180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input0);
    			set_input_value(input0, /*token*/ ctx[1]);
    			append_dev(form, t4);
    			append_dev(form, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*token*/ 2 && input0.value !== /*token*/ ctx[1]) {
    				set_input_value(input0, /*token*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValidateToken', slots, []);
    	let { onValidate } = $$props;
    	let token;
    	const writable_props = ['onValidate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValidateToken> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		token = this.value;
    		$$invalidate(1, token);
    	}

    	const submit_handler = () => onValidate(token);

    	$$self.$$set = $$props => {
    		if ('onValidate' in $$props) $$invalidate(0, onValidate = $$props.onValidate);
    	};

    	$$self.$capture_state = () => ({ onValidate, token });

    	$$self.$inject_state = $$props => {
    		if ('onValidate' in $$props) $$invalidate(0, onValidate = $$props.onValidate);
    		if ('token' in $$props) $$invalidate(1, token = $$props.token);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onValidate, token, input0_input_handler, submit_handler];
    }

    class ValidateToken extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Z, create_fragment$Z, safe_not_equal, { onValidate: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValidateToken",
    			options,
    			id: create_fragment$Z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onValidate*/ ctx[0] === undefined && !('onValidate' in props)) {
    			console.warn("<ValidateToken> was created without expected prop 'onValidate'");
    		}
    	}

    	get onValidate() {
    		throw new Error("<ValidateToken>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onValidate(value) {
    		throw new Error("<ValidateToken>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\join\RegisterAuthentication.svelte generated by Svelte v3.48.0 */
    const file$T = "src\\Public\\Signup\\join\\RegisterAuthentication.svelte";

    function create_fragment$Y(ctx) {
    	let form;
    	let label0;
    	let t0;
    	let input0;
    	let t1;
    	let label1;
    	let t3;
    	let passwordinput0;
    	let updating_password;
    	let t4;
    	let label2;
    	let t6;
    	let passwordinput1;
    	let updating_password_1;
    	let t7;
    	let input1;
    	let current;
    	let mounted;
    	let dispose;

    	function passwordinput0_password_binding(value) {
    		/*passwordinput0_password_binding*/ ctx[6](value);
    	}

    	let passwordinput0_props = {};

    	if (/*password*/ ctx[0] !== void 0) {
    		passwordinput0_props.password = /*password*/ ctx[0];
    	}

    	passwordinput0 = new PasswordInput({
    			props: passwordinput0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(passwordinput0, 'password', passwordinput0_password_binding));

    	function passwordinput1_password_binding(value) {
    		/*passwordinput1_password_binding*/ ctx[7](value);
    	}

    	let passwordinput1_props = {
    		error: !/*match*/ ctx[4],
    		id: "re-password"
    	};

    	if (/*rePass*/ ctx[3] !== void 0) {
    		passwordinput1_props.password = /*rePass*/ ctx[3];
    	}

    	passwordinput1 = new PasswordInput({
    			props: passwordinput1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(passwordinput1, 'password', passwordinput1_password_binding));
    	passwordinput1.$on("input", /*checkMatch*/ ctx[5]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			label0 = element("label");
    			t0 = text("Din E-mail\r\n\t\t");
    			input0 = element("input");
    			t1 = space();
    			label1 = element("label");
    			label1.textContent = "Adgangskode*";
    			t3 = space();
    			create_component(passwordinput0.$$.fragment);
    			t4 = space();
    			label2 = element("label");
    			label2.textContent = "Bekræft adgangskode*";
    			t6 = space();
    			create_component(passwordinput1.$$.fragment);
    			t7 = space();
    			input1 = element("input");
    			input0.value = /*email*/ ctx[1];
    			input0.readOnly = true;
    			attr_dev(input0, "class", "w3-large w3-center w3-border-white");
    			add_location(input0, file$T, 30, 2, 611);
    			add_location(label0, file$T, 28, 1, 586);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$T, 32, 1, 700);
    			attr_dev(label2, "for", "re-password");
    			add_location(label2, file$T, 35, 1, 782);
    			attr_dev(input1, "type", "submit");
    			attr_dev(input1, "class", "w3-button w3-blue w3-hover-black w3-left-align");
    			input1.value = "Bekræft";
    			toggle_class(input1, "w3-disabled", !/*match*/ ctx[4] || /*rePass*/ ctx[3] === '');
    			add_location(input1, file$T, 42, 1, 949);
    			add_location(form, file$T, 22, 0, 436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, label0);
    			append_dev(label0, t0);
    			append_dev(label0, input0);
    			append_dev(form, t1);
    			append_dev(form, label1);
    			append_dev(form, t3);
    			mount_component(passwordinput0, form, null);
    			append_dev(form, t4);
    			append_dev(form, label2);
    			append_dev(form, t6);
    			mount_component(passwordinput1, form, null);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[8]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*email*/ 2 && input0.value !== /*email*/ ctx[1]) {
    				prop_dev(input0, "value", /*email*/ ctx[1]);
    			}

    			const passwordinput0_changes = {};

    			if (!updating_password && dirty & /*password*/ 1) {
    				updating_password = true;
    				passwordinput0_changes.password = /*password*/ ctx[0];
    				add_flush_callback(() => updating_password = false);
    			}

    			passwordinput0.$set(passwordinput0_changes);
    			const passwordinput1_changes = {};
    			if (dirty & /*match*/ 16) passwordinput1_changes.error = !/*match*/ ctx[4];

    			if (!updating_password_1 && dirty & /*rePass*/ 8) {
    				updating_password_1 = true;
    				passwordinput1_changes.password = /*rePass*/ ctx[3];
    				add_flush_callback(() => updating_password_1 = false);
    			}

    			passwordinput1.$set(passwordinput1_changes);

    			if (dirty & /*match, rePass*/ 24) {
    				toggle_class(input1, "w3-disabled", !/*match*/ ctx[4] || /*rePass*/ ctx[3] === '');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(passwordinput0.$$.fragment, local);
    			transition_in(passwordinput1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(passwordinput0.$$.fragment, local);
    			transition_out(passwordinput1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(passwordinput0);
    			destroy_component(passwordinput1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterAuthentication', slots, []);
    	let { email } = $$props;
    	let { password } = $$props;
    	let { registerAuthentication } = $$props;
    	let rePass = '123456789';
    	let match = true;

    	function checkMatch() {
    		if (rePass.length > 0) {
    			if (password !== rePass) {
    				$$invalidate(4, match = false);
    			} else {
    				$$invalidate(4, match = true);
    			}
    		}
    	}

    	const writable_props = ['email', 'password', 'registerAuthentication'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterAuthentication> was created with unknown prop '${key}'`);
    	});

    	function passwordinput0_password_binding(value) {
    		password = value;
    		$$invalidate(0, password);
    	}

    	function passwordinput1_password_binding(value) {
    		rePass = value;
    		$$invalidate(3, rePass);
    	}

    	const submit_handler = () => match
    	? registerAuthentication({ email, password })
    	: notifyError$1('Adganskode matcher ikke');

    	$$self.$$set = $$props => {
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('password' in $$props) $$invalidate(0, password = $$props.password);
    		if ('registerAuthentication' in $$props) $$invalidate(2, registerAuthentication = $$props.registerAuthentication);
    	};

    	$$self.$capture_state = () => ({
    		PasswordInput,
    		notifyError: notifyError$1,
    		email,
    		password,
    		registerAuthentication,
    		rePass,
    		match,
    		checkMatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('password' in $$props) $$invalidate(0, password = $$props.password);
    		if ('registerAuthentication' in $$props) $$invalidate(2, registerAuthentication = $$props.registerAuthentication);
    		if ('rePass' in $$props) $$invalidate(3, rePass = $$props.rePass);
    		if ('match' in $$props) $$invalidate(4, match = $$props.match);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		password,
    		email,
    		registerAuthentication,
    		rePass,
    		match,
    		checkMatch,
    		passwordinput0_password_binding,
    		passwordinput1_password_binding,
    		submit_handler
    	];
    }

    class RegisterAuthentication extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$Y, create_fragment$Y, safe_not_equal, {
    			email: 1,
    			password: 0,
    			registerAuthentication: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterAuthentication",
    			options,
    			id: create_fragment$Y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*email*/ ctx[1] === undefined && !('email' in props)) {
    			console.warn("<RegisterAuthentication> was created without expected prop 'email'");
    		}

    		if (/*password*/ ctx[0] === undefined && !('password' in props)) {
    			console.warn("<RegisterAuthentication> was created without expected prop 'password'");
    		}

    		if (/*registerAuthentication*/ ctx[2] === undefined && !('registerAuthentication' in props)) {
    			console.warn("<RegisterAuthentication> was created without expected prop 'registerAuthentication'");
    		}
    	}

    	get email() {
    		throw new Error("<RegisterAuthentication>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<RegisterAuthentication>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get password() {
    		throw new Error("<RegisterAuthentication>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set password(value) {
    		throw new Error("<RegisterAuthentication>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerAuthentication() {
    		throw new Error("<RegisterAuthentication>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerAuthentication(value) {
    		throw new Error("<RegisterAuthentication>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\join\RegisterUser.svelte generated by Svelte v3.48.0 */

    const file$S = "src\\Public\\Signup\\join\\RegisterUser.svelte";

    function create_fragment$X(ctx) {
    	let div;
    	let h1;
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
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let input4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Opret en bruger";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Nu har vi brug for dine personlige oplysninger";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			t4 = text("Fornavn*\r\n\t\t");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			t6 = text("Efternavn*\r\n\t\t");
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			t8 = text("Mobil nummer\r\n\t\t");
    			input2 = element("input");
    			t9 = space();
    			label3 = element("label");
    			t10 = text("Profil billede\r\n\t\t");
    			input3 = element("input");
    			t11 = space();
    			input4 = element("input");
    			add_location(h1, file$S, 12, 1, 186);
    			add_location(p, file$S, 13, 1, 213);
    			attr_dev(div, "class", "title");
    			add_location(div, file$S, 11, 0, 164);
    			attr_dev(input0, "class", "w3-card-2 inputs");
    			attr_dev(input0, "placeholder", "Fornavn");
    			input0.required = true;
    			add_location(input0, file$S, 18, 2, 360);
    			add_location(label0, file$S, 16, 1, 337);
    			attr_dev(input1, "class", "w3-card-2 inputs");
    			attr_dev(input1, "placeholder", "Efternavn");
    			input1.required = true;
    			add_location(input1, file$S, 27, 2, 513);
    			add_location(label1, file$S, 25, 1, 488);
    			attr_dev(input2, "class", "w3-card-2 inputs");
    			attr_dev(input2, "placeholder", "Mobil nummer");
    			add_location(input2, file$S, 36, 2, 669);
    			add_location(label2, file$S, 34, 1, 642);
    			attr_dev(input3, "class", "w3-card-2 inputs");
    			attr_dev(input3, "placeholder", "link til et profil billede");
    			add_location(input3, file$S, 44, 2, 814);
    			add_location(label3, file$S, 42, 1, 785);
    			attr_dev(input4, "type", "submit");
    			attr_dev(input4, "class", "w3-button w3-left-align w3-hover-black");
    			input4.value = "Opret";
    			add_location(input4, file$S, 50, 1, 941);
    			add_location(form, file$S, 15, 0, 276);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, label0);
    			append_dev(label0, t4);
    			append_dev(label0, input0);
    			set_input_value(input0, /*detail*/ ctx[1].firstname);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(label1, t6);
    			append_dev(label1, input1);
    			set_input_value(input1, /*detail*/ ctx[1].lastname);
    			append_dev(form, t7);
    			append_dev(form, label2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*detail*/ ctx[1].phone);
    			append_dev(form, t9);
    			append_dev(form, label3);
    			append_dev(label3, t10);
    			append_dev(label3, input3);
    			set_input_value(input3, /*detail*/ ctx[1].pb);
    			append_dev(form, t11);
    			append_dev(form, input4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[4]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*detail*/ 2 && input0.value !== /*detail*/ ctx[1].firstname) {
    				set_input_value(input0, /*detail*/ ctx[1].firstname);
    			}

    			if (dirty & /*detail*/ 2 && input1.value !== /*detail*/ ctx[1].lastname) {
    				set_input_value(input1, /*detail*/ ctx[1].lastname);
    			}

    			if (dirty & /*detail*/ 2 && input2.value !== /*detail*/ ctx[1].phone) {
    				set_input_value(input2, /*detail*/ ctx[1].phone);
    			}

    			if (dirty & /*detail*/ 2 && input3.value !== /*detail*/ ctx[1].pb) {
    				set_input_value(input3, /*detail*/ ctx[1].pb);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$X.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$X($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterUser', slots, []);

    	let detail = {
    		admin: false,
    		firstname: 'Malik',
    		lastname: 'Mayo',
    		phone: '42154651',
    		pb: ''
    	};

    	let { onRegister } = $$props;
    	const writable_props = ['onRegister'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterUser> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		detail.firstname = this.value;
    		$$invalidate(1, detail);
    	}

    	function input1_input_handler() {
    		detail.lastname = this.value;
    		$$invalidate(1, detail);
    	}

    	function input2_input_handler() {
    		detail.phone = this.value;
    		$$invalidate(1, detail);
    	}

    	function input3_input_handler() {
    		detail.pb = this.value;
    		$$invalidate(1, detail);
    	}

    	const submit_handler = () => onRegister(detail);

    	$$self.$$set = $$props => {
    		if ('onRegister' in $$props) $$invalidate(0, onRegister = $$props.onRegister);
    	};

    	$$self.$capture_state = () => ({ detail, onRegister });

    	$$self.$inject_state = $$props => {
    		if ('detail' in $$props) $$invalidate(1, detail = $$props.detail);
    		if ('onRegister' in $$props) $$invalidate(0, onRegister = $$props.onRegister);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		onRegister,
    		detail,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		submit_handler
    	];
    }

    class RegisterUser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$X, create_fragment$X, safe_not_equal, { onRegister: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterUser",
    			options,
    			id: create_fragment$X.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onRegister*/ ctx[0] === undefined && !('onRegister' in props)) {
    			console.warn("<RegisterUser> was created without expected prop 'onRegister'");
    		}
    	}

    	get onRegister() {
    		throw new Error("<RegisterUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRegister(value) {
    		throw new Error("<RegisterUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup\Join.svelte generated by Svelte v3.48.0 */

    const file$R = "src\\Public\\Signup\\Join.svelte";

    // (96:22) 
    function create_if_block_3$2(ctx) {
    	let registeruser;
    	let current;

    	registeruser = new RegisterUser({
    			props: { onRegister: /*registerUser*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(registeruser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(registeruser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const registeruser_changes = {};
    			if (dirty & /*registerUser*/ 8) registeruser_changes.onRegister = /*registerUser*/ ctx[3];
    			registeruser.$set(registeruser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(registeruser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(registeruser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(registeruser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(96:22) ",
    		ctx
    	});

    	return block;
    }

    // (90:22) 
    function create_if_block_2$4(ctx) {
    	let registerauthentication;
    	let updating_email;
    	let updating_password;
    	let current;

    	function registerauthentication_email_binding(value) {
    		/*registerauthentication_email_binding*/ ctx[12](value);
    	}

    	function registerauthentication_password_binding(value) {
    		/*registerauthentication_password_binding*/ ctx[13](value);
    	}

    	let registerauthentication_props = {
    		registerAuthentication: /*onRegisterAuthentication*/ ctx[7]
    	};

    	if (/*email*/ ctx[0] !== void 0) {
    		registerauthentication_props.email = /*email*/ ctx[0];
    	}

    	if (/*password*/ ctx[4] !== void 0) {
    		registerauthentication_props.password = /*password*/ ctx[4];
    	}

    	registerauthentication = new RegisterAuthentication({
    			props: registerauthentication_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(registerauthentication, 'email', registerauthentication_email_binding));
    	binding_callbacks.push(() => bind(registerauthentication, 'password', registerauthentication_password_binding));

    	const block = {
    		c: function create() {
    			create_component(registerauthentication.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(registerauthentication, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const registerauthentication_changes = {};

    			if (!updating_email && dirty & /*email*/ 1) {
    				updating_email = true;
    				registerauthentication_changes.email = /*email*/ ctx[0];
    				add_flush_callback(() => updating_email = false);
    			}

    			if (!updating_password && dirty & /*password*/ 16) {
    				updating_password = true;
    				registerauthentication_changes.password = /*password*/ ctx[4];
    				add_flush_callback(() => updating_password = false);
    			}

    			registerauthentication.$set(registerauthentication_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(registerauthentication.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(registerauthentication.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(registerauthentication, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(90:22) ",
    		ctx
    	});

    	return block;
    }

    // (50:22) 
    function create_if_block_1$9(ctx) {
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
    	let input2;
    	let t8;
    	let a0;
    	let t10;
    	let a1;
    	let t12;
    	let input3;
    	let input3_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Bekræft detaljerne";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Hvis detaljerene nedunder ikke er korrekte, skal du ikke forsætte\r\n\t\t\t\t\toprettelsen og istedet kontakt en ansvarlig fra din virksomhed";
    			t3 = space();
    			form = element("form");
    			label0 = element("label");
    			t4 = text("Din Virksomhed\r\n\t\t\t\t\t");
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			t6 = text("Din E-mail\r\n\t\t\t\t\t");
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t8 = text("\r\n\t\t\t\t\tJeg acceptere\r\n\t\t\t\t\t");
    			a0 = element("a");
    			a0.textContent = "vilkårene og betingelserne";
    			t10 = text("\r\n\t\t\t\t\tog\r\n\t\t\t\t\t");
    			a1 = element("a");
    			a1.textContent = "Fortrolighedspolitik";
    			t12 = space();
    			input3 = element("input");
    			add_location(h2, file$R, 52, 4, 1368);
    			add_location(p, file$R, 53, 4, 1401);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$R, 51, 3, 1343);
    			input0.value = /*companyName*/ ctx[1];
    			input0.readOnly = true;
    			attr_dev(input0, "class", "w3-large w3-center w3-border-white");
    			add_location(input0, file$R, 61, 5, 1643);
    			add_location(label0, file$R, 59, 4, 1608);
    			input1.value = /*email*/ ctx[0];
    			input1.readOnly = true;
    			attr_dev(input1, "class", "w3-large w3-center w3-border-white");
    			add_location(input1, file$R, 69, 5, 1802);
    			add_location(label1, file$R, 67, 4, 1771);
    			attr_dev(input2, "type", "checkbox");
    			input2.required = true;
    			add_location(input2, file$R, 72, 5, 1911);
    			attr_dev(a0, "href", "/terms/Terms&Conditions.html");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$R, 74, 5, 1997);
    			attr_dev(a1, "href", "/terms/PrivacyPolicy.html");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$R, 78, 5, 2113);
    			add_location(label2, file$R, 71, 4, 1897);
    			attr_dev(input3, "type", "submit");
    			attr_dev(input3, "class", "w3-button w3-blue w3-hover-black w3-left-align");
    			input3.value = "Bekræft";
    			input3.disabled = input3_disabled_value = !/*termAgree*/ ctx[5];
    			add_location(input3, file$R, 81, 4, 2216);
    			add_location(form, file$R, 58, 3, 1571);
    			attr_dev(div1, "class", "w3-animate-bottom");
    			add_location(div1, file$R, 50, 2, 1307);
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
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(label1, t6);
    			append_dev(label1, input1);
    			append_dev(form, t7);
    			append_dev(form, label2);
    			append_dev(label2, input2);
    			input2.checked = /*termAgree*/ ctx[5];
    			append_dev(label2, t8);
    			append_dev(label2, a0);
    			append_dev(label2, t10);
    			append_dev(label2, a1);
    			append_dev(form, t12);
    			append_dev(form, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[10]),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*companyName*/ 2 && input0.value !== /*companyName*/ ctx[1]) {
    				prop_dev(input0, "value", /*companyName*/ ctx[1]);
    			}

    			if (dirty & /*email*/ 1 && input1.value !== /*email*/ ctx[0]) {
    				prop_dev(input1, "value", /*email*/ ctx[0]);
    			}

    			if (dirty & /*termAgree*/ 32) {
    				input2.checked = /*termAgree*/ ctx[5];
    			}

    			if (dirty & /*termAgree*/ 32 && input3_disabled_value !== (input3_disabled_value = !/*termAgree*/ ctx[5])) {
    				prop_dev(input3, "disabled", input3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(50:22) ",
    		ctx
    	});

    	return block;
    }

    // (48:1) {#if step === 0}
    function create_if_block$e(ctx) {
    	let validatetoken;
    	let current;

    	validatetoken = new ValidateToken({
    			props: {
    				onValidate: /*validateRegistrationToken*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(validatetoken.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(validatetoken, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(validatetoken.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(validatetoken.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(validatetoken, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(48:1) {#if step === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$e, create_if_block_1$9, create_if_block_2$4, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*step*/ ctx[2] === 0) return 0;
    		if (/*step*/ ctx[2] === 1) return 1;
    		if (/*step*/ ctx[2] === 2) return 2;
    		if (/*step*/ ctx[2] === 3) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "content parent");
    			add_location(div, file$R, 46, 0, 1172);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
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
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Join', slots, []);
    	let { registerUser } = $$props;
    	let { registerAuthentication } = $$props;
    	let { email } = $$props;
    	let { companyName } = $$props;
    	let { companyId } = $$props;
    	let { step } = $$props;
    	let password = '123456789';
    	let termAgree = false;

    	async function validateRegistrationToken(token) {
    		const { payload, error } = await apiPost(POST_INVITATION_VALIDATION('activation'), { token });

    		if (payload) {
    			notifySuccess('Token valideret');
    			$$invalidate(0, email = payload.info.email);
    			$$invalidate(8, companyId = payload.info.companyId);
    			$$invalidate(1, companyName = payload.info.name);
    			$$invalidate(2, step++, step);
    		} else notifyError$1(error.message);
    	}

    	async function onRegisterAuthentication(e) {
    		await registerAuthentication(e, 'join');
    	}

    	const writable_props = [
    		'registerUser',
    		'registerAuthentication',
    		'email',
    		'companyName',
    		'companyId',
    		'step'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Join> was created with unknown prop '${key}'`);
    	});

    	function input2_change_handler() {
    		termAgree = this.checked;
    		$$invalidate(5, termAgree);
    	}

    	const submit_handler = () => $$invalidate(2, step++, step);

    	function registerauthentication_email_binding(value) {
    		email = value;
    		$$invalidate(0, email);
    	}

    	function registerauthentication_password_binding(value) {
    		password = value;
    		$$invalidate(4, password);
    	}

    	$$self.$$set = $$props => {
    		if ('registerUser' in $$props) $$invalidate(3, registerUser = $$props.registerUser);
    		if ('registerAuthentication' in $$props) $$invalidate(9, registerAuthentication = $$props.registerAuthentication);
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('companyName' in $$props) $$invalidate(1, companyName = $$props.companyName);
    		if ('companyId' in $$props) $$invalidate(8, companyId = $$props.companyId);
    		if ('step' in $$props) $$invalidate(2, step = $$props.step);
    	};

    	$$self.$capture_state = () => ({
    		apiPost,
    		ValidateToken,
    		RegisterAuthentication,
    		RegisterUser,
    		notifyError: notifyError$1,
    		notifySuccess,
    		GET_INVITATION_VALIDATION,
    		POST_EMPLOYEE,
    		POST_INVITATION_VALIDATION,
    		registerUser,
    		registerAuthentication,
    		email,
    		companyName,
    		companyId,
    		step,
    		password,
    		termAgree,
    		validateRegistrationToken,
    		onRegisterAuthentication
    	});

    	$$self.$inject_state = $$props => {
    		if ('registerUser' in $$props) $$invalidate(3, registerUser = $$props.registerUser);
    		if ('registerAuthentication' in $$props) $$invalidate(9, registerAuthentication = $$props.registerAuthentication);
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('companyName' in $$props) $$invalidate(1, companyName = $$props.companyName);
    		if ('companyId' in $$props) $$invalidate(8, companyId = $$props.companyId);
    		if ('step' in $$props) $$invalidate(2, step = $$props.step);
    		if ('password' in $$props) $$invalidate(4, password = $$props.password);
    		if ('termAgree' in $$props) $$invalidate(5, termAgree = $$props.termAgree);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		email,
    		companyName,
    		step,
    		registerUser,
    		password,
    		termAgree,
    		validateRegistrationToken,
    		onRegisterAuthentication,
    		companyId,
    		registerAuthentication,
    		input2_change_handler,
    		submit_handler,
    		registerauthentication_email_binding,
    		registerauthentication_password_binding
    	];
    }

    class Join extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$W, create_fragment$W, safe_not_equal, {
    			registerUser: 3,
    			registerAuthentication: 9,
    			email: 0,
    			companyName: 1,
    			companyId: 8,
    			step: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Join",
    			options,
    			id: create_fragment$W.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*registerUser*/ ctx[3] === undefined && !('registerUser' in props)) {
    			console.warn("<Join> was created without expected prop 'registerUser'");
    		}

    		if (/*registerAuthentication*/ ctx[9] === undefined && !('registerAuthentication' in props)) {
    			console.warn("<Join> was created without expected prop 'registerAuthentication'");
    		}

    		if (/*email*/ ctx[0] === undefined && !('email' in props)) {
    			console.warn("<Join> was created without expected prop 'email'");
    		}

    		if (/*companyName*/ ctx[1] === undefined && !('companyName' in props)) {
    			console.warn("<Join> was created without expected prop 'companyName'");
    		}

    		if (/*companyId*/ ctx[8] === undefined && !('companyId' in props)) {
    			console.warn("<Join> was created without expected prop 'companyId'");
    		}

    		if (/*step*/ ctx[2] === undefined && !('step' in props)) {
    			console.warn("<Join> was created without expected prop 'step'");
    		}
    	}

    	get registerUser() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerUser(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get registerAuthentication() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set registerAuthentication(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get companyName() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set companyName(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get companyId() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set companyId(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Public\Signup.svelte generated by Svelte v3.48.0 */

    const file$Q = "src\\Public\\Signup.svelte";

    // (109:0) {:else}
    function create_else_block$8(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: false,
    				$$slots: { default: [create_default_slot$x] },
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

    			if (dirty & /*$$scope, step, email, companyName, companyId*/ 524318) {
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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(109:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (107:0) {#if isLoading}
    function create_if_block$d(ctx) {
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(107:0) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (113:4) <Route path="/">
    function create_default_slot_3$3(ctx) {
    	let intro;
    	let current;
    	intro = new Intro({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(intro.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(intro, target, anchor);
    			current = true;
    		},
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(intro.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intro.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intro, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(113:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:4) <Route path="create">
    function create_default_slot_2$3(ctx) {
    	let create;
    	let current;

    	create = new Create({
    			props: {
    				step: /*step*/ ctx[4],
    				registerUser: /*onRegisterUser*/ ctx[7],
    				registerCompany: /*onRegisterCompany*/ ctx[6],
    				registerAuthentication: /*onRegisterAuthentication*/ ctx[5]
    			},
    			$$inline: true
    		});

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
    			if (dirty & /*step*/ 16) create_changes.step = /*step*/ ctx[4];
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
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(115:4) <Route path=\\\"create\\\">",
    		ctx
    	});

    	return block;
    }

    // (124:4) <Route path="join">
    function create_default_slot_1$5(ctx) {
    	let join;
    	let updating_step;
    	let updating_email;
    	let updating_companyName;
    	let updating_companyId;
    	let current;

    	function join_step_binding(value) {
    		/*join_step_binding*/ ctx[8](value);
    	}

    	function join_email_binding(value) {
    		/*join_email_binding*/ ctx[9](value);
    	}

    	function join_companyName_binding(value) {
    		/*join_companyName_binding*/ ctx[10](value);
    	}

    	function join_companyId_binding(value) {
    		/*join_companyId_binding*/ ctx[11](value);
    	}

    	let join_props = {
    		registerUser: /*onRegisterUser*/ ctx[7],
    		registerAuthentication: /*onRegisterAuthentication*/ ctx[5]
    	};

    	if (/*step*/ ctx[4] !== void 0) {
    		join_props.step = /*step*/ ctx[4];
    	}

    	if (/*email*/ ctx[1] !== void 0) {
    		join_props.email = /*email*/ ctx[1];
    	}

    	if (/*companyName*/ ctx[2] !== void 0) {
    		join_props.companyName = /*companyName*/ ctx[2];
    	}

    	if (/*companyId*/ ctx[3] !== void 0) {
    		join_props.companyId = /*companyId*/ ctx[3];
    	}

    	join = new Join({ props: join_props, $$inline: true });
    	binding_callbacks.push(() => bind(join, 'step', join_step_binding));
    	binding_callbacks.push(() => bind(join, 'email', join_email_binding));
    	binding_callbacks.push(() => bind(join, 'companyName', join_companyName_binding));
    	binding_callbacks.push(() => bind(join, 'companyId', join_companyId_binding));

    	const block = {
    		c: function create() {
    			create_component(join.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(join, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const join_changes = {};

    			if (!updating_step && dirty & /*step*/ 16) {
    				updating_step = true;
    				join_changes.step = /*step*/ ctx[4];
    				add_flush_callback(() => updating_step = false);
    			}

    			if (!updating_email && dirty & /*email*/ 2) {
    				updating_email = true;
    				join_changes.email = /*email*/ ctx[1];
    				add_flush_callback(() => updating_email = false);
    			}

    			if (!updating_companyName && dirty & /*companyName*/ 4) {
    				updating_companyName = true;
    				join_changes.companyName = /*companyName*/ ctx[2];
    				add_flush_callback(() => updating_companyName = false);
    			}

    			if (!updating_companyId && dirty & /*companyId*/ 8) {
    				updating_companyId = true;
    				join_changes.companyId = /*companyId*/ ctx[3];
    				add_flush_callback(() => updating_companyId = false);
    			}

    			join.$set(join_changes);
    		},
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(124:4) <Route path=\\\"join\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:1) <Router primary={false}>
    function create_default_slot$x(ctx) {
    	let div1;
    	let div0;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "create",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "join",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(div0, "class", "content signup-parent  svelte-bz4hm2");
    			add_location(div0, file$Q, 111, 3, 2580);
    			attr_dev(div1, "class", "container svelte-bz4hm2");
    			add_location(div1, file$Q, 110, 2, 2552);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(route0, div0, null);
    			append_dev(div0, t0);
    			mount_component(route1, div0, null);
    			append_dev(div0, t1);
    			mount_component(route2, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, step*/ 524304) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, step, email, companyName, companyId*/ 524318) {
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
    			if (detaching) detach_dev(div1);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$x.name,
    		type: "slot",
    		source: "(110:1) <Router primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$V(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
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
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let $user;
    	let $invitationInfo;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(15, $user = $$value));
    	validate_store(invitationInfo, 'invitationInfo');
    	component_subscribe($$self, invitationInfo, $$value => $$invalidate(16, $invitationInfo = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	let isLoading = false;
    	let creatorId = '';
    	let email = 'samirali@live.dk';
    	let companyName = 'MinVirk';
    	let companyId = '';
    	let inProgress = false;
    	let step = 0;
    	let authentication = {};

    	onMount(() => {
    		if ($invitationInfo) {
    			$$invalidate(1, email = $invitationInfo.email);
    			$$invalidate(2, companyName = $invitationInfo.companyName);
    			$$invalidate(3, companyId = $invitationInfo.companyId);
    			inProgress = true;
    			$$invalidate(4, step = 1);
    		}
    	});

    	async function onRegisterAuthentication(e, type) {
    		$$invalidate(0, isLoading = true);
    		const { payload, error } = await authPost(SIGNUP(), e);

    		if (payload) {
    			creatorId = payload.id;
    			authentication = e;

    			if (type === 'join') {
    				await addToCompany();
    			}

    			$$invalidate(4, step++, step);
    		} else notifyError$1(error.message);

    		$$invalidate(0, isLoading = false);
    	}

    	async function addToCompany() {
    		const { error } = await apiPost(POST_EMPLOYEE(companyId), { id: creatorId });

    		if (error) {
    			notifyError$1(error.message);
    		}
    	}

    	async function onRegisterCompany(e) {
    		$$invalidate(0, isLoading = true);
    		const { payload, error } = await apiPost(POST_COMPANY(creatorId), e);

    		if (payload) {
    			$$invalidate(3, companyId = payload.companyId);
    			$$invalidate(4, step++, step);
    		} else notifyError$1(error.message);

    		$$invalidate(0, isLoading = false);
    	}

    	async function onRegisterUser(e) {
    		$$invalidate(0, isLoading = true);
    		const { payload, error } = await apiPost(POST_USER({ companyId, userId: creatorId }), { user: e, email: authentication.email });

    		if (payload) {
    			await onSignin(authentication);
    		} else notifyError$1(error.message);

    		$$invalidate(0, isLoading = false);
    	}

    	async function onSignin(e) {
    		$$invalidate(0, isLoading = true);
    		const { payload, error } = await authPost('signin', e);

    		if (payload) {
    			set_store_value(user, $user = payload.user, $user);
    			notifySuccess(`Velkommen, ${$user.firstname} ${$user.lastname}`);
    		} else notifyError$1(error.message);

    		$$invalidate(0, isLoading = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	function join_step_binding(value) {
    		step = value;
    		$$invalidate(4, step);
    	}

    	function join_email_binding(value) {
    		email = value;
    		$$invalidate(1, email);
    	}

    	function join_companyName_binding(value) {
    		companyName = value;
    		$$invalidate(2, companyName);
    	}

    	function join_companyId_binding(value) {
    		companyId = value;
    		$$invalidate(3, companyId);
    	}

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Intro,
    		Create,
    		Join,
    		Loader,
    		authPost,
    		apiPost,
    		notifyError: notifyError$1,
    		notifySuccess,
    		user,
    		invitationInfo,
    		onMount,
    		SIGNUP,
    		POST_COMPANY,
    		POST_USER,
    		POST_EMPLOYEE,
    		isLoading,
    		creatorId,
    		email,
    		companyName,
    		companyId,
    		inProgress,
    		step,
    		authentication,
    		onRegisterAuthentication,
    		addToCompany,
    		onRegisterCompany,
    		onRegisterUser,
    		onSignin,
    		$user,
    		$invitationInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    		if ('creatorId' in $$props) creatorId = $$props.creatorId;
    		if ('email' in $$props) $$invalidate(1, email = $$props.email);
    		if ('companyName' in $$props) $$invalidate(2, companyName = $$props.companyName);
    		if ('companyId' in $$props) $$invalidate(3, companyId = $$props.companyId);
    		if ('inProgress' in $$props) inProgress = $$props.inProgress;
    		if ('step' in $$props) $$invalidate(4, step = $$props.step);
    		if ('authentication' in $$props) authentication = $$props.authentication;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isLoading,
    		email,
    		companyName,
    		companyId,
    		step,
    		onRegisterAuthentication,
    		onRegisterCompany,
    		onRegisterUser,
    		join_step_binding,
    		join_email_binding,
    		join_companyName_binding,
    		join_companyId_binding
    	];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$V, create_fragment$V, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$V.name
    		});
    	}
    }

    /* src\Routes\PublicRoutes.svelte generated by Svelte v3.48.0 */

    // (10:1) <Route path="/">
    function create_default_slot_3$2(ctx) {
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
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(10:1) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Route path="/signup/*">
    function create_default_slot_2$2(ctx) {
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(13:1) <Route path=\\\"/signup/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:1) <Route>
    function create_default_slot_1$4(ctx) {
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(16:1) <Route>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Public>
    function create_default_slot$w(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/signup/*",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
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

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_default_slot$w.name,
    		type: "slot",
    		source: "(9:0) <Public>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$U(ctx) {
    	let public_1;
    	let current;

    	public_1 = new Public({
    			props: {
    				$$slots: { default: [create_default_slot$w] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(public_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(public_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const public_1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PublicRoutes', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PublicRoutes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route: Route$1, Public, Login, Signup });
    	return [];
    }

    class PublicRoutes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$U, create_fragment$U, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PublicRoutes",
    			options,
    			id: create_fragment$U.name
    		});
    	}
    }

    const page = writable(sessionStorage.getItem('lastVisited') || '/');

    const isLoading = writable(false);

    const themes = writable([
    	{
    		name: 'default',
    		'display-name': 'Original',
    		primary: '#000000',
    		secondary: '#0088ff',
    		text: '#fff',
    	},

    	{
    		name: 'honesty',
    		'display-name': 'Ærlighed',
    		primary: '#89ABE3FF',
    		secondary: '#FCF6F5FF',
    		text: '#000',
    	},
    	{
    		name: 'summer',
    		'display-name': 'Sommer',
    		primary: '#00B1D2FF',
    		secondary: '#FDDB27FF',
    		text: '#000',
    	},
    	{
    		name: 'easy_going',
    		'display-name': 'Stille og Rolig',
    		primary: '#101820FF',
    		secondary: '#FEE715FF',
    		text: '#fff',
    	},
    	{
    		name: 'seabed',
    		'display-name': 'Havbund',
    		primary: '#FC766AFF',
    		secondary: '#5B84B1FF',
    		text: '#fff',
    	},
    	{
    		name: 'strength_and_hope',
    		'display-name': 'Styrke og Håb',
    		primary: '#949398FF',
    		secondary: '#F4DF4EFF',
    		text: '#000',
    	},
    	{
    		name: 'vibrant',
    		'display-name': 'Levende',
    		primary: '#00A4CCFF',
    		secondary: '#F95700FF',
    		text: '#000',
    	},
    	{
    		name: 'tropical',
    		'display-name': 'Tropisk',
    		primary: '#42EADDFF',
    		secondary: '#CDB599FF',
    		text: '#fff',
    	},
    	{
    		name: 'cold_mint',
    		'display-name': 'Frisk Mynte',
    		primary: '#00203FFF',
    		secondary: '#ADEFD1FF',
    		text: '#fff',
    	},
    	{
    		name: 'greenery',
    		'display-name': 'Naturen',
    		primary: '#03811c', //
    		secondary: '#3db217',
    		text: '#fff',
    	},
    	{
    		name: 'creativity',
    		'display-name': 'Kreativit',
    		primary: '#00539CFF',
    		secondary: '#EEA47FFF',
    		text: '#fff',
    	},
    	{
    		name: 'cherry_tomato',
    		'display-name': 'Cherry Tomat',
    		primary: '#2D2926FF',
    		secondary: '#E94B3CFF',
    		text: '#fff',
    	},
    	{
    		name: 'magic',
    		'display-name': 'Magi',
    		primary: '#5F4B8BFF',
    		secondary: '#E69A8DFF',
    		text: '#fff',
    	},
    	{
    		name: 'custom',
    		'display-name': 'custom',
    		primary: '',
    		secondary: '',
    		text: '#fff',
    	},
    ]);
    derived(themes, ($themes) => {
    	return $themes.find((t) => t.name === 'default').primary;
    });
    derived(themes, ($themes) => {
    	return $themes.find((t) => t.name === 'default').secondary;
    });

    localStorage.setItem('theme', 'default');
    const theme = writable('default');

    const primary_color = derived([theme, themes], ($value, set) => {
    	set($value[1].find((c) => c.name === $value[0]).primary || '#000');
    });

    const secondary_color = derived([theme, themes], ($value, set) => {
    	set($value[1].find((c) => c.name === $value[0]).secondary || '#0088ff');
    });

    const text_color = derived([theme, themes], ($value, set) => {
    	set($value[1].find((c) => c.name === $value[0]).text);
    });

    /* node_modules\svelte-icons\ti\TiHomeOutline.svelte generated by Svelte v3.48.0 */
    const file$P = "node_modules\\svelte-icons\\ti\\TiHomeOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$v(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M22.262 10.468c-3.39-2.854-9.546-8.171-9.607-8.225l-.655-.563-.652.563c-.062.053-6.221 5.368-9.66 8.248-.438.394-.688.945-.688 1.509 0 1.104.896 2 2 2h1v6c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-6h1c1.104 0 2-.896 2-2 0-.598-.275-1.161-.738-1.532zm-8.262 9.532h-4v-5h4v5zm4-8l.002 8h-3.002v-6h-6v6h-3v-8h-3.001c2.765-2.312 7.315-6.227 9.001-7.68 1.686 1.453 6.234 5.367 9 7.681l-3-.001z");
    			add_location(path, file$P, 4, 10, 151);
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
    		id: create_default_slot$v.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$T(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$v] },
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
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiHomeOutline",
    			options,
    			id: create_fragment$T.name
    		});
    	}
    }

    /* node_modules\svelte-icons\md\MdSchedule.svelte generated by Svelte v3.48.0 */
    const file$O = "node_modules\\svelte-icons\\md\\MdSchedule.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$u(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z");
    			add_location(path, file$O, 4, 10, 151);
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
    		id: create_default_slot$u.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$u] },
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
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MdSchedule",
    			options,
    			id: create_fragment$S.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosChatboxes.svelte generated by Svelte v3.48.0 */
    const file$N = "node_modules\\svelte-icons\\io\\IoIosChatboxes.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$t(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M425.9 170.4H204.3c-21 0-38.1 17.1-38.1 38.1v154.3c0 21 17.1 38 38.1 38h126.8c2.8 0 5.6 1.2 7.6 3.2l63 58.1c3.5 3.4 9.3 2 9.3-2.9v-50.6c0-6 3.8-7.9 9.8-7.9h1c21 0 42.1-16.9 42.1-38V208.5c.1-21.1-17-38.1-38-38.1z");
    			add_location(path0, file$N, 4, 10, 153);
    			attr_dev(path1, "d", "M174.4 145.9h177.4V80.6c0-18-14.6-32.6-32.6-32.6H80.6C62.6 48 48 62.6 48 80.6v165.2c0 18 14.6 32.6 32.6 32.6h61.1v-99.9c.1-18 14.7-32.6 32.7-32.6z");
    			add_location(path1, file$N, 5, 0, 378);
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
    		id: create_default_slot$t.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$t] },
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
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$R, create_fragment$R, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosChatboxes",
    			options,
    			id: create_fragment$R.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosClose.svelte generated by Svelte v3.48.0 */
    const file$M = "node_modules\\svelte-icons\\io\\IoIosClose.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$s(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z");
    			add_location(path, file$M, 4, 10, 153);
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
    		id: create_default_slot$s.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$s] },
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
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosClose",
    			options,
    			id: create_fragment$Q.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosPeople.svelte generated by Svelte v3.48.0 */
    const file$L = "node_modules\\svelte-icons\\io\\IoIosPeople.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$r(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M349.1 334.7c-11.2-4-29.5-4.2-37.6-7.3-5.6-2.2-14.5-4.6-17.4-8.1-2.9-3.5-2.9-28.5-2.9-28.5s7-6.6 9.9-14c2.9-7.3 4.8-27.5 4.8-27.5s6.6 2.8 9.2-10.4c2.2-11.4 6.4-17.4 5.3-25.8-1.2-8.4-5.8-6.4-5.8-6.4s5.8-8.5 5.8-37.4c0-29.8-22.5-59.1-64.6-59.1-42 0-64.7 29.4-64.7 59.1 0 28.9 5.7 37.4 5.7 37.4s-4.7-2-5.8 6.4c-1.2 8.4 3 14.4 5.3 25.8 2.6 13.3 9.2 10.4 9.2 10.4s1.9 20.1 4.8 27.5c2.9 7.4 9.9 14 9.9 14s0 25-2.9 28.5-11.8 5.9-17.4 8c-8 3.1-26.3 3.5-37.6 7.5-11.2 4-45.8 22.2-45.8 67.2h278.3c.1-45.1-34.5-63.3-45.7-67.3z");
    			add_location(path0, file$L, 4, 10, 153);
    			attr_dev(path1, "d", "M140 286s23.9-.8 33.4-9.3c-15.5-23.5-7.1-50.9-10.3-76.5-3.2-25.5-17.7-40.8-46.7-40.8h-.4c-28 0-43.1 15.2-46.3 40.8-3.2 25.5 5.7 56-10.2 76.5C69 285.3 93 285 93 285s1 14.4-1 16.8c-2 2.4-7.9 4.7-12 5.5-8.8 1.9-18.1 4.5-25.9 7.2-7.8 2.7-22.6 17.2-22.6 37.2h80.3c2.2-8 17.3-22.3 32-29.8 9-4.6 17.9-4.3 24.7-5.2 0 0 3.8-6-8.7-8.3 0 0-17.2-4.3-19.2-6.7-1.9-2.2-.6-15.7-.6-15.7zM372 286s-23.9-.8-33.4-9.3c15.5-23.5 7.1-50.9 10.3-76.5 3.2-25.5 17.7-40.8 46.7-40.8h.4c28 0 43.1 15.2 46.3 40.8 3.2 25.5-5.7 56 10.2 76.5-9.5 8.6-33.5 8.3-33.5 8.3s-1 14.4 1 16.8c2 2.4 7.9 4.7 12 5.5 8.8 1.9 18.1 4.5 25.9 7.2 7.8 2.7 22.6 17.2 22.6 37.2h-80.3c-2.2-8-17.3-22.3-32-29.8-9-4.6-17.9-4.3-24.7-5.2 0 0-3.8-6 8.7-8.3 0 0 17.2-4.3 19.2-6.7 1.9-2.2.6-15.7.6-15.7z");
    			add_location(path1, file$L, 5, 0, 682);
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
    		id: create_default_slot$r.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$P(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$r] },
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
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosPeople",
    			options,
    			id: create_fragment$P.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiArrowSortedUp.svelte generated by Svelte v3.48.0 */
    const file$K = "node_modules\\svelte-icons\\ti\\TiArrowSortedUp.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$q(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M18.2 13.3l-6.2-6.3-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7z");
    			add_location(path, file$K, 4, 10, 151);
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
    		id: create_default_slot$q.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$q] },
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
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiArrowSortedUp",
    			options,
    			id: create_fragment$O.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosSettings.svelte generated by Svelte v3.48.0 */
    const file$J = "node_modules\\svelte-icons\\io\\IoIosSettings.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$p(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M416.3 256c0-21 13.1-38.9 31.7-46.1-4.9-20.5-13-39.7-23.7-57.1-6.4 2.8-13.2 4.3-20.1 4.3-12.6 0-25.2-4.8-34.9-14.4-14.9-14.9-18.2-36.8-10.2-55-17.3-10.7-36.6-18.8-57-23.7C295 82.5 277 95.7 256 95.7S217 82.5 209.9 64c-20.5 4.9-39.7 13-57.1 23.7 8.1 18.1 4.7 40.1-10.2 55-9.6 9.6-22.3 14.4-34.9 14.4-6.9 0-13.7-1.4-20.1-4.3C77 170.3 68.9 189.5 64 210c18.5 7.1 31.7 25 31.7 46.1 0 21-13.1 38.9-31.6 46.1 4.9 20.5 13 39.7 23.7 57.1 6.4-2.8 13.2-4.2 20-4.2 12.6 0 25.2 4.8 34.9 14.4 14.8 14.8 18.2 36.8 10.2 54.9 17.4 10.7 36.7 18.8 57.1 23.7 7.1-18.5 25-31.6 46-31.6s38.9 13.1 46 31.6c20.5-4.9 39.7-13 57.1-23.7-8-18.1-4.6-40 10.2-54.9 9.6-9.6 22.2-14.4 34.9-14.4 6.8 0 13.7 1.4 20 4.2 10.7-17.4 18.8-36.7 23.7-57.1-18.4-7.2-31.6-25.1-31.6-46.2zm-159.4 79.9c-44.3 0-80-35.9-80-80s35.7-80 80-80 80 35.9 80 80-35.7 80-80 80z");
    			add_location(path, file$J, 4, 10, 153);
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
    		id: create_default_slot$p.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$p] },
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
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosSettings",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiMessage.svelte generated by Svelte v3.48.0 */
    const file$I = "node_modules\\svelte-icons\\ti\\TiMessage.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$o(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M18 7c.542 0 1 .458 1 1v7c0 .542-.458 1-1 1h-8.829l-.171.171v-.171h-3c-.542 0-1-.458-1-1v-7c0-.542.458-1 1-1h12m0-2h-12c-1.65 0-3 1.35-3 3v7c0 1.65 1.35 3 3 3h1v3l3-3h8c1.65 0 3-1.35 3-3v-7c0-1.65-1.35-3-3-3z");
    			add_location(path, file$I, 4, 10, 151);
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
    		id: create_default_slot$o.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$o] },
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
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiMessage",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosHelpCircleOutline.svelte generated by Svelte v3.48.0 */
    const file$H = "node_modules\\svelte-icons\\io\\IoIosHelpCircleOutline.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$n(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z");
    			add_location(path0, file$H, 4, 10, 153);
    			attr_dev(path1, "d", "M256.7 160c37.5 0 63.3 20.8 63.3 50.7 0 19.8-9.6 33.5-28.1 44.4-17.4 10.1-23.3 17.5-23.3 30.3v7.9h-34.7l-.3-8.6c-1.7-20.6 5.5-33.4 23.6-44 16.9-10.1 24-16.5 24-28.9s-12-21.5-26.9-21.5c-15.1 0-26 9.8-26.8 24.6H192c.7-32.2 24.5-54.9 64.7-54.9zm-26.3 171.4c0-11.5 9.6-20.6 21.4-20.6 11.9 0 21.5 9 21.5 20.6s-9.6 20.6-21.5 20.6-21.4-9-21.4-20.6z");
    			add_location(path1, file$H, 5, 0, 423);
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
    		id: create_default_slot$n.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$L(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$n] },
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
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosHelpCircleOutline",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosLogOut.svelte generated by Svelte v3.48.0 */
    const file$G = "node_modules\\svelte-icons\\io\\IoIosLogOut.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$m(ctx) {
    	let path0;
    	let t;
    	let path1;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t = space();
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M312 372c-7.7 0-14 6.3-14 14 0 9.9-8.1 18-18 18H94c-9.9 0-18-8.1-18-18V126c0-9.9 8.1-18 18-18h186c9.9 0 18 8.1 18 18 0 7.7 6.3 14 14 14s14-6.3 14-14c0-25.4-20.6-46-46-46H94c-25.4 0-46 20.6-46 46v260c0 25.4 20.6 46 46 46h186c25.4 0 46-20.6 46-46 0-7.7-6.3-14-14-14z");
    			add_location(path0, file$G, 4, 10, 153);
    			attr_dev(path1, "d", "M372.9 158.1c-2.6-2.6-6.1-4.1-9.9-4.1-3.7 0-7.3 1.4-9.9 4.1-5.5 5.5-5.5 14.3 0 19.8l65.2 64.2H162c-7.7 0-14 6.3-14 14s6.3 14 14 14h256.6L355 334.2c-5.4 5.4-5.4 14.3 0 19.8l.1.1c2.7 2.5 6.2 3.9 9.8 3.9 3.8 0 7.3-1.4 9.9-4.1l82.6-82.4c4.3-4.3 6.5-9.3 6.5-14.7 0-5.3-2.3-10.3-6.5-14.5l-84.5-84.2z");
    			add_location(path1, file$G, 5, 0, 431);
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
    		id: create_default_slot$m.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$m] },
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
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosLogOut",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosArrowForward.svelte generated by Svelte v3.48.0 */
    const file$F = "node_modules\\svelte-icons\\io\\IoIosArrowForward.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$l(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z");
    			add_location(path, file$F, 4, 10, 153);
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
    		id: create_default_slot$l.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$l] },
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
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowForward",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* src\Components\Menu\MenuItem.svelte generated by Svelte v3.48.0 */

    const file$E = "src\\Components\\Menu\\MenuItem.svelte";

    function create_fragment$I(ctx) {
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
    			attr_dev(div0, "class", "sidebar-icon svelte-1s305ia");
    			add_location(div0, file$E, 15, 1, 371);
    			add_location(div1, file$E, 18, 1, 450);
    			attr_dev(div2, "class", "sidebar-arrow svelte-1s305ia");
    			add_location(div2, file$E, 21, 1, 482);
    			attr_dev(div3, "class", "sidebar-item svelte-1s305ia");
    			add_location(div3, file$E, 11, 0, 270);
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
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuItem', slots, []);
    	const dispatch = createEventDispatcher();
    	let { item } = $$props;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('onClick', { endpoint: item.endpoint });

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		IoIosArrowForward,
    		createEventDispatcher,
    		dispatch,
    		item
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, dispatch, click_handler];
    }

    class MenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuItem",
    			options,
    			id: create_fragment$I.name
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
    const file$D = "src\\Components\\Menu\\MenuSection.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:1) {#each items as item}
    function create_each_block$6(ctx) {
    	let menuitem;
    	let current;

    	menuitem = new MenuItem({
    			props: { item: /*item*/ ctx[3] },
    			$$inline: true
    		});

    	menuitem.$on("onClick", /*onClick_handler*/ ctx[2]);

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
    			if (dirty & /*items*/ 2) menuitem_changes.item = /*item*/ ctx[3];
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(9:1) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*style*/ ctx[0]) + " svelte-lvf3el"));
    			add_location(div, file$D, 7, 0, 109);
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
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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

    			if (!current || dirty & /*style*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*style*/ ctx[0]) + " svelte-lvf3el"))) {
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
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuSection', slots, []);
    	let { style } = $$props;
    	let { items } = $$props;
    	const writable_props = ['style', 'items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuSection> was created with unknown prop '${key}'`);
    	});

    	function onClick_handler(event) {
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

    	return [style, items, onClick_handler];
    }

    class MenuSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { style: 0, items: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuSection",
    			options,
    			id: create_fragment$H.name
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
    const file$C = "src\\Components\\Menu\\Menu.svelte";

    // (31:0) {#if show}
    function create_if_block$c(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let tiarrowsortedup;
    	let t0;
    	let div1;
    	let img;
    	let img_src_value;
    	let t1;
    	let p;
    	let t2_value = /*$user*/ ctx[3].firstname + "";
    	let t2;
    	let t3;
    	let t4_value = /*$user*/ ctx[3].lastname + "";
    	let t4;
    	let t5;
    	let t6;
    	let menusection0;
    	let t7;
    	let menusection1;
    	let t8;
    	let menusection2;
    	let current;
    	tiarrowsortedup = new TiArrowSortedUp({ $$inline: true });
    	let if_block = /*mode*/ ctx[1] !== 'C' && create_if_block_1$8(ctx);

    	menusection0 = new MenuSection({
    			props: {
    				items: /*menu_items*/ ctx[4],
    				style: "menu-sidebar"
    			},
    			$$inline: true
    		});

    	menusection0.$on("onClick", /*onClick_handler_1*/ ctx[8]);

    	menusection1 = new MenuSection({
    			props: {
    				items: /*help_items*/ ctx[5],
    				style: "help-sidebar"
    			},
    			$$inline: true
    		});

    	menusection1.$on("onClick", /*onClick_handler_2*/ ctx[9]);

    	menusection2 = new MenuSection({
    			props: {
    				items: /*tool_items*/ ctx[6],
    				style: "tool-sidebar"
    			},
    			$$inline: true
    		});

    	menusection2.$on("onClick", /*onClick_handler_3*/ ctx[10]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(tiarrowsortedup.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			create_component(menusection0.$$.fragment);
    			t7 = space();
    			create_component(menusection1.$$.fragment);
    			t8 = space();
    			create_component(menusection2.$$.fragment);
    			attr_dev(div0, "class", "menu-arrow svelte-1qeor9y");
    			add_location(div0, file$C, 38, 3, 1086);
    			attr_dev(img, "class", "w3-image w3-circle user-sidebar-pb svelte-1qeor9y");
    			if (!src_url_equal(img.src, img_src_value = /*$user*/ ctx[3].pb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "profile");
    			add_location(img, file$C, 42, 4, 1193);
    			attr_dev(p, "class", "user-sidebar-name");
    			add_location(p, file$C, 47, 4, 1301);
    			attr_dev(div1, "class", "user-sidebar-container svelte-1qeor9y");
    			add_location(div1, file$C, 41, 3, 1151);
    			attr_dev(div2, "class", "user-sidebar svelte-1qeor9y");
    			add_location(div2, file$C, 37, 2, 1055);
    			attr_dev(div3, "class", "w3-card-4 menu svelte-1qeor9y");
    			toggle_class(div3, "compact", /*mode*/ ctx[1] === 'C');
    			toggle_class(div3, "medium", /*mode*/ ctx[1] === 'M');
    			toggle_class(div3, "full", /*mode*/ ctx[1] === 'F');
    			add_location(div3, file$C, 31, 1, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(tiarrowsortedup, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div3, t5);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t6);
    			mount_component(menusection0, div3, null);
    			append_dev(div3, t7);
    			mount_component(menusection1, div3, null);
    			append_dev(div3, t8);
    			mount_component(menusection2, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$user*/ 8 && !src_url_equal(img.src, img_src_value = /*$user*/ ctx[3].pb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*$user*/ 8) && t2_value !== (t2_value = /*$user*/ ctx[3].firstname + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$user*/ 8) && t4_value !== (t4_value = /*$user*/ ctx[3].lastname + "")) set_data_dev(t4, t4_value);

    			if (/*mode*/ ctx[1] !== 'C') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mode*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, t6);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*mode*/ 2) {
    				toggle_class(div3, "compact", /*mode*/ ctx[1] === 'C');
    			}

    			if (dirty & /*mode*/ 2) {
    				toggle_class(div3, "medium", /*mode*/ ctx[1] === 'M');
    			}

    			if (dirty & /*mode*/ 2) {
    				toggle_class(div3, "full", /*mode*/ ctx[1] === 'F');
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
    			if (detaching) detach_dev(div3);
    			destroy_component(tiarrowsortedup);
    			if (if_block) if_block.d();
    			destroy_component(menusection0);
    			destroy_component(menusection1);
    			destroy_component(menusection2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(31:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (51:2) {#if mode !== 'C'}
    function create_if_block_1$8(ctx) {
    	let menusection;
    	let current;

    	menusection = new MenuSection({
    			props: {
    				items: /*navigation_items*/ ctx[0],
    				style: "navigation-sidebar"
    			},
    			$$inline: true
    		});

    	menusection.$on("onClick", /*onClick_handler*/ ctx[7]);

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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(51:2) {#if mode !== 'C'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[2] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
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
    			if (/*show*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
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
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { navigation_items = {} } = $$props;

    	let menu_items = [
    		{
    			name: 'Kontoindstillinger',
    			icon: IoIosSettings,
    			endpoint: '/mysettings'
    		}
    	];

    	let help_items = [
    		{
    			name: 'Kontakt',
    			icon: TiMessage,
    			endpoint: '/'
    		},
    		{
    			name: 'Guide og FAQ',
    			icon: IoIosHelpCircleOutline,
    			endpoint: '/'
    		}
    	];

    	let tool_items = [
    		{
    			name: 'Log ud',
    			icon: IoIosLogOut,
    			endpoint: '/signout'
    		}
    	];

    	let { mode } = $$props;
    	let { show } = $$props;
    	const writable_props = ['navigation_items', 'mode', 'show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function onClick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onClick_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onClick_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onClick_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(0, navigation_items = $$props.navigation_items);
    		if ('mode' in $$props) $$invalidate(1, mode = $$props.mode);
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    	};

    	$$self.$capture_state = () => ({
    		TiArrowSortedUp,
    		IoIosSettings,
    		TiMessage,
    		IoIosHelpCircleOutline,
    		IoIosLogOut,
    		navigation_items,
    		user,
    		menu_items,
    		help_items,
    		tool_items,
    		MenuSection,
    		mode,
    		show,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('navigation_items' in $$props) $$invalidate(0, navigation_items = $$props.navigation_items);
    		if ('menu_items' in $$props) $$invalidate(4, menu_items = $$props.menu_items);
    		if ('help_items' in $$props) $$invalidate(5, help_items = $$props.help_items);
    		if ('tool_items' in $$props) $$invalidate(6, tool_items = $$props.tool_items);
    		if ('mode' in $$props) $$invalidate(1, mode = $$props.mode);
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		navigation_items,
    		mode,
    		show,
    		$user,
    		menu_items,
    		help_items,
    		tool_items,
    		onClick_handler,
    		onClick_handler_1,
    		onClick_handler_2,
    		onClick_handler_3
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, { navigation_items: 0, mode: 1, show: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$G.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mode*/ ctx[1] === undefined && !('mode' in props)) {
    			console.warn("<Menu> was created without expected prop 'mode'");
    		}

    		if (/*show*/ ctx[2] === undefined && !('show' in props)) {
    			console.warn("<Menu> was created without expected prop 'show'");
    		}
    	}

    	get navigation_items() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigation_items(value) {
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
    const file$B = "node_modules\\svelte-icons\\io\\IoIosArrowDown.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$k(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z");
    			add_location(path, file$B, 4, 10, 153);
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
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$k] },
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
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowDown",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosArrowUp.svelte generated by Svelte v3.48.0 */
    const file$A = "node_modules\\svelte-icons\\io\\IoIosArrowUp.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$j(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z");
    			add_location(path, file$A, 4, 10, 153);
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
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$j] },
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
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowUp",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* node_modules\svelte-icons\fa\FaUserCircle.svelte generated by Svelte v3.48.0 */
    const file$z = "node_modules\\svelte-icons\\fa\\FaUserCircle.svelte";

    // (4:8) <IconBase viewBox="0 0 496 512" {...$$props}>
    function create_default_slot$i(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z");
    			add_location(path, file$z, 4, 10, 153);
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
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 496 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 496 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$i] },
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
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaUserCircle",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* node_modules\svelte-icons\ti\TiThMenu.svelte generated by Svelte v3.48.0 */
    const file$y = "node_modules\\svelte-icons\\ti\\TiThMenu.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$h(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 17h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2zM19 10h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2zM19 3h-14c-1.103 0-2 .897-2 2s.897 2 2 2h14c1.103 0 2-.897 2-2s-.897-2-2-2z");
    			add_location(path, file$y, 4, 10, 151);
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
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$h] },
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
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TiThMenu",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src\Components\Menu\MyAccount.svelte generated by Svelte v3.48.0 */
    const file$x = "src\\Components\\Menu\\MyAccount.svelte";

    // (24:1) {:else}
    function create_else_block_1$4(ctx) {
    	let div;
    	let tithmenu;
    	let current;
    	tithmenu = new TiThMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tithmenu.$$.fragment);
    			attr_dev(div, "class", "menu-icon svelte-1ldt1ok");
    			add_location(div, file$x, 24, 2, 666);
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
    		id: create_else_block_1$4.name,
    		type: "else",
    		source: "(24:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:1) {#if menu_mode === 'C'}
    function create_if_block$b(ctx) {
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
    	const if_block_creators = [create_if_block_1$7, create_else_block$7];
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
    			attr_dev(div0, "class", "sidebar-icon svelte-1ldt1ok");
    			add_location(div0, file$x, 13, 3, 423);
    			attr_dev(span0, "class", "my-account svelte-1ldt1ok");
    			add_location(span0, file$x, 14, 3, 476);
    			attr_dev(span1, "class", "arrow svelte-1ldt1ok");
    			add_location(span1, file$x, 15, 3, 522);
    			attr_dev(div1, "class", "myAccount svelte-1ldt1ok");
    			add_location(div1, file$x, 12, 2, 395);
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
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(12:1) {#if menu_mode === 'C'}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {:else}
    function create_else_block$7(ctx) {
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(19:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if show}
    function create_if_block_1$7(ctx) {
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
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(17:4) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$b, create_else_block_1$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*menu_mode*/ ctx[1] === 'C') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$x, 10, 0, 328);
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
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
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

    class MyAccount$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { show: 0, menu_mode: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyAccount",
    			options,
    			id: create_fragment$B.name
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

    /* src\Components\Menu\MenuLinks.svelte generated by Svelte v3.48.0 */
    const file$w = "src\\Components\\Menu\\MenuLinks.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (10:1) {#each navigation_items as item}
    function create_each_block$5(ctx) {
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
    			attr_dev(a, "class", "link svelte-b8sgev");
    			toggle_class(a, "current", /*page*/ ctx[0] === /*item*/ ctx[3].endpoint);
    			add_location(a, file$w, 10, 2, 238);
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(10:1) {#each navigation_items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let div_intro;
    	let each_value = /*navigation_items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "link-container svelte-b8sgev");
    			add_location(div, file$w, 8, 0, 162);
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { navigation_items: 1, page: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuLinks",
    			options,
    			id: create_fragment$A.name
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

    const context = {
      subscribe: null,
      addNotification: null,
      removeNotification: null,
      clearNotifications: null,
    };

    const getNotificationsContext = () => getContext(context);

    /* node_modules\svelte-notifications\src\components\Notification.svelte generated by Svelte v3.48.0 */

    function create_fragment$z(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*item*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: {
    				notification: /*notification*/ ctx[1],
    				withoutStyles: /*withoutStyles*/ ctx[2],
    				onRemove: /*removeNotificationHandler*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*notification*/ 2) switch_instance_changes.notification = /*notification*/ ctx[1];
    			if (dirty & /*withoutStyles*/ 4) switch_instance_changes.withoutStyles = /*withoutStyles*/ ctx[2];

    			if (switch_value !== (switch_value = /*item*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notification', slots, []);
    	let { item } = $$props;
    	let { notification = {} } = $$props;
    	let { withoutStyles = false } = $$props;
    	const { removeNotification } = getNotificationsContext();
    	const { id, removeAfter } = notification;
    	const removeNotificationHandler = () => removeNotification(id);
    	let timeout = null;

    	if (removeAfter) {
    		timeout = setTimeout(removeNotificationHandler, removeAfter);
    	}

    	onDestroy(() => {
    		if (removeAfter && timeout) clearTimeout(timeout);
    	});

    	const writable_props = ['item', 'notification', 'withoutStyles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('notification' in $$props) $$invalidate(1, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(2, withoutStyles = $$props.withoutStyles);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		getNotificationsContext,
    		item,
    		notification,
    		withoutStyles,
    		removeNotification,
    		id,
    		removeAfter,
    		removeNotificationHandler,
    		timeout
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('notification' in $$props) $$invalidate(1, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(2, withoutStyles = $$props.withoutStyles);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, notification, withoutStyles, removeNotificationHandler];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			item: 0,
    			notification: 1,
    			withoutStyles: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<Notification> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notification() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-notifications\src\components\DefaultNotification.svelte generated by Svelte v3.48.0 */
    const file$v = "node_modules\\svelte-notifications\\src\\components\\DefaultNotification.svelte";

    // (103:10) {text}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*text*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(103:10) {text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let button;
    	let t1;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			button = element("button");
    			t1 = text("×");
    			attr_dev(div0, "class", "" + (null_to_empty(/*getClass*/ ctx[2]('content')) + " svelte-2oyqkv"));
    			add_location(div0, file$v, 101, 2, 2236);
    			attr_dev(button, "class", "" + (null_to_empty(/*getClass*/ ctx[2]('button')) + " svelte-2oyqkv"));
    			attr_dev(button, "aria-label", "delete notification");
    			add_location(button, file$v, 104, 2, 2305);
    			attr_dev(div1, "class", "" + (null_to_empty(/*getClass*/ ctx[2]()) + " svelte-2oyqkv"));
    			attr_dev(div1, "role", "status");
    			attr_dev(div1, "aria-live", "polite");
    			add_location(div1, file$v, 94, 0, 2148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, button);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onRemove*/ ctx[0])) /*onRemove*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fade, {});
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			dispose();
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

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DefaultNotification', slots, ['default']);
    	let { notification = {} } = $$props;
    	let { withoutStyles = false } = $$props;
    	let { onRemove = null } = $$props;
    	const { text, type } = notification;

    	const getClass = suffix => {
    		const defaultSuffix = suffix ? `-${suffix}` : '';
    		const defaultNotificationClass = ` default-notification-style${defaultSuffix}`;
    		const defaultNotificationType = type && !suffix ? ` default-notification-${type}` : '';
    		return `notification${defaultSuffix}${withoutStyles ? '' : defaultNotificationClass}${defaultNotificationType}`;
    	};

    	const writable_props = ['notification', 'withoutStyles', 'onRemove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DefaultNotification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('notification' in $$props) $$invalidate(3, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(4, withoutStyles = $$props.withoutStyles);
    		if ('onRemove' in $$props) $$invalidate(0, onRemove = $$props.onRemove);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		notification,
    		withoutStyles,
    		onRemove,
    		text,
    		type,
    		getClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('notification' in $$props) $$invalidate(3, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(4, withoutStyles = $$props.withoutStyles);
    		if ('onRemove' in $$props) $$invalidate(0, onRemove = $$props.onRemove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onRemove, text, getClass, notification, withoutStyles, $$scope, slots];
    }

    class DefaultNotification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			notification: 3,
    			withoutStyles: 4,
    			onRemove: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DefaultNotification",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get notification() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onRemove() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRemove(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const positions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];

    const addNotification = (notification, store) => {
      if (!notification) return;

      const { update } = store;
      const safeNotification = {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 9999)}`,
        position: 'bottom-center',
        text: '',
        ...notification,
      };

      if (!safeNotification.text || typeof safeNotification.text !== 'string') return;
      if (!positions.includes(notification.position)) return;

      update((notifications) => {
        if (safeNotification.position.includes('top-')) {
          return [safeNotification, ...notifications];
        }

        return [...notifications, safeNotification];
      });
    };

    const removeNotification = (notificationId, { update }) => {
      if (!notificationId) return;

      update((notifications) => notifications.filter(({ id }) => id !== notificationId));
    };

    const clearNotifications = (store) => store.set([]);

    const createStore = () => {
      const store = writable([]);

      return {
        subscribe: store.subscribe,
        addNotification: (notification) => addNotification(notification, store),
        removeNotification: (notificationId) => removeNotification(notificationId, store),
        clearNotifications: () => clearNotifications(store),
      };
    };

    var store = createStore();

    /* node_modules\svelte-notifications\src\components\Notifications.svelte generated by Svelte v3.48.0 */
    const file$u = "node_modules\\svelte-notifications\\src\\components\\Notifications.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (71:8) {#if notification.position === position}
    function create_if_block$a(ctx) {
    	let notification;
    	let current;

    	notification = new Notification({
    			props: {
    				notification: /*notification*/ ctx[9],
    				withoutStyles: /*withoutStyles*/ ctx[1],
    				item: /*item*/ ctx[0] || DefaultNotification
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notification, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notification_changes = {};
    			if (dirty & /*$store*/ 4) notification_changes.notification = /*notification*/ ctx[9];
    			if (dirty & /*withoutStyles*/ 2) notification_changes.withoutStyles = /*withoutStyles*/ ctx[1];
    			if (dirty & /*item*/ 1) notification_changes.item = /*item*/ ctx[0] || DefaultNotification;
    			notification.$set(notification_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(71:8) {#if notification.position === position}",
    		ctx
    	});

    	return block;
    }

    // (70:6) {#each $store as notification (notification.id)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*notification*/ ctx[9].position === /*position*/ ctx[6] && create_if_block$a(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty$1();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*notification*/ ctx[9].position === /*position*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store*/ 4) {
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
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(70:6) {#each $store as notification (notification.id)}",
    		ctx
    	});

    	return block;
    }

    // (68:2) {#each positions as position}
    function create_each_block$4(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;
    	let each_value_1 = /*$store*/ ctx[2];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*notification*/ ctx[9].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "" + (null_to_empty(/*getClass*/ ctx[3](/*position*/ ctx[6])) + " svelte-t0tmtn"));
    			add_location(div, file$u, 68, 4, 1451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store, withoutStyles, item, DefaultNotification, positions*/ 7) {
    				each_value_1 = /*$store*/ ctx[2];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1, t, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(68:2) {#each positions as position}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let t;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let each_value = positions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "notifications");
    			add_location(div, file$u, 66, 0, 1387);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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

    			if (dirty & /*getClass, positions, $store, withoutStyles, item, DefaultNotification*/ 15) {
    				each_value = positions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(2, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notifications', slots, ['default']);
    	let { item = null } = $$props;
    	let { withoutStyles = false } = $$props;

    	const getClass = (position = '') => {
    		const defaultPositionClass = ` default-position-style-${position}`;
    		return `position-${position}${withoutStyles ? '' : defaultPositionClass}`;
    	};

    	setContext(context, store);
    	const writable_props = ['item', 'withoutStyles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('withoutStyles' in $$props) $$invalidate(1, withoutStyles = $$props.withoutStyles);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		Notification,
    		DefaultNotification,
    		context,
    		store,
    		positions,
    		item,
    		withoutStyles,
    		getClass,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('withoutStyles' in $$props) $$invalidate(1, withoutStyles = $$props.withoutStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, withoutStyles, $store, getClass, $$scope, slots];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { item: 0, withoutStyles: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get item() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\NavBar.svelte generated by Svelte v3.48.0 */
    const file$t = "src\\Components\\NavBar.svelte";

    // (120:1) {#if menu_mode === 'C'}
    function create_if_block_1$6(ctx) {
    	let div;
    	let menulinks;
    	let updating_page;
    	let current;

    	function menulinks_page_binding(value) {
    		/*menulinks_page_binding*/ ctx[7](value);
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
    			add_location(div, file$t, 120, 2, 3001);
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
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(120:1) {#if menu_mode === 'C'}",
    		ctx
    	});

    	return block;
    }

    // (130:1) {#if show && menu_mode !== 'C'}
    function create_if_block$9(ctx) {
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
    			attr_dev(div, "class", "menu-close svelte-fbkngq");
    			add_location(div, file$t, 130, 2, 3232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(ioiosclose, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[8], false, false, false);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(130:1) {#if show && menu_mode !== 'C'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div4;
    	let div0;
    	let logo;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div3;
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
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	logo = new Logo({ props: { size: 'M' }, $$inline: true });
    	let if_block0 = /*menu_mode*/ ctx[4] === 'C' && create_if_block_1$6(ctx);
    	let if_block1 = /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== 'C' && create_if_block$9(ctx);

    	function myaccount_show_binding(value) {
    		/*myaccount_show_binding*/ ctx[9](value);
    	}

    	let myaccount_props = { menu_mode: /*menu_mode*/ ctx[4] };

    	if (/*show*/ ctx[2] !== void 0) {
    		myaccount_props.show = /*show*/ ctx[2];
    	}

    	myaccount = new MyAccount$1({ props: myaccount_props, $$inline: true });
    	binding_callbacks.push(() => bind(myaccount, 'show', myaccount_show_binding));

    	function menu_mode_binding(value) {
    		/*menu_mode_binding*/ ctx[10](value);
    	}

    	function menu_show_binding(value) {
    		/*menu_show_binding*/ ctx[11](value);
    	}

    	let menu_props = {
    		navigation_items: /*navigation_items*/ ctx[3]
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
    	menu.$on("onClick", /*onClick*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(myaccount.$$.fragment);
    			t4 = space();
    			create_component(menu.$$.fragment);
    			attr_dev(div0, "class", "logo-container svelte-fbkngq");
    			add_location(div0, file$t, 114, 1, 2892);
    			attr_dev(div1, "class", "svelte-fbkngq");
    			toggle_class(div1, "overlay", /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== 'C');
    			add_location(div1, file$t, 126, 1, 3127);
    			attr_dev(div2, "class", "menu");
    			add_location(div2, file$t, 134, 2, 3330);
    			add_location(div3, file$t, 133, 1, 3321);
    			attr_dev(div4, "class", "nav svelte-fbkngq");
    			add_location(div4, file$t, 112, 0, 2856);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			mount_component(logo, div0, null);
    			append_dev(div4, t0);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			mount_component(myaccount, div2, null);
    			append_dev(div3, t4);
    			mount_component(menu, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menu_mode*/ ctx[4] === 'C') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*menu_mode*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*show, menu_mode*/ 20) {
    				toggle_class(div1, "overlay", /*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== 'C');
    			}

    			if (/*show*/ ctx[2] && /*menu_mode*/ ctx[4] !== 'C') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*show, menu_mode*/ 20) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, t3);
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
    			if (detaching) detach_dev(div4);
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let menu_mode;
    	let $page;
    	let $user;
    	let $isAdmin;
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(12, $user = $$value));
    	validate_store(isAdmin, 'isAdmin');
    	component_subscribe($$self, isAdmin, $$value => $$invalidate(13, $isAdmin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	const { addNotification } = getNotificationsContext();
    	let show = false;

    	//array with available links
    	let navigation_items = [
    		{
    			name: 'Oversigt',
    			icon: TiHomeOutline,
    			endpoint: '/'
    		},
    		{
    			name: 'Vagtplan',
    			icon: MdSchedule,
    			endpoint: '/schedule'
    		},
    		{
    			name: 'Beskeder',
    			icon: IoIosChatboxes,
    			endpoint: '/messages'
    		}
    	];

    	onMount(() => {
    		if ($isAdmin) {
    			$$invalidate(3, navigation_items = [
    				...navigation_items,
    				{
    					name: 'Medarbejder',
    					icon: IoIosPeople,
    					endpoint: '/employees'
    				}
    			]);
    		}
    	});

    	joined(data => {
    		addNotification({
    			text: data,
    			position: 'bottom-right',
    			removeAfter: 2000
    		});
    	});

    	left(function (data) {
    		addNotification({
    			text: data,
    			position: 'bottom-right',
    			removeAfter: 2000,
    			type: 'danger'
    		});
    	});

    	let screenWidth;

    	async function checkAuth() {
    		const { error } = await authGet(null);

    		if (error) {
    			set_store_value(page, $page = '/', $page);
    			set_store_value(user, $user = {}, $user);
    			notifyInfo('Du er blevet logget ud');
    		}
    	}

    	async function signout() {
    		const { success, error } = await SIGNOUT();

    		if (success) {
    			DISCONNECT();
    			set_store_value(page, $page = '/', $page);
    			set_store_value(user, $user = {}, $user);
    			sessionStorage.setItem('lastVisited', '/');
    			sessionStorage.removeItem('userId');
    			localStorage.removeItem('savedTheme');
    			navigate('/');
    		} else notifyError(error.message);
    	}

    	async function onClick(e) {
    		const endpoint = e.detail.endpoint;

    		if (endpoint === '/signout') {
    			await signout();
    		} else {
    			$$invalidate(2, show = false);
    			set_store_value(page, $page = endpoint, $page);
    		}
    	}

    	const writable_props = [];

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

    	$$self.$capture_state = () => ({
    		navigate,
    		onMount,
    		user,
    		isAdmin,
    		page,
    		TiHomeOutline,
    		MdSchedule,
    		IoIosChatboxes,
    		IoIosClose,
    		IoIosPeople,
    		Menu,
    		MyAccount: MyAccount$1,
    		MenuLinks,
    		Logo,
    		SIGNOUT,
    		authGet,
    		notifyInfo,
    		DISCONNECT,
    		joined,
    		left,
    		getNotificationsContext,
    		addNotification,
    		show,
    		navigation_items,
    		screenWidth,
    		checkAuth,
    		signout,
    		onClick,
    		menu_mode,
    		$page,
    		$user,
    		$isAdmin
    	});

    	$$self.$inject_state = $$props => {
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
    			sessionStorage.setItem('lastVisited', $page);
    		}

    		if ($$self.$$.dirty & /*screenWidth*/ 1) {
    			//compact, medium, full
    			$$invalidate(4, menu_mode = screenWidth > 1100 ? 'C' : screenWidth > 760 ? 'M' : 'F');
    		}

    		if ($$self.$$.dirty & /*$page*/ 2) {
    			navigate($page);
    		}

    		if ($$self.$$.dirty & /*$page*/ 2) {
    			if ($page) {
    				checkAuth();
    			}
    		}
    	};

    	return [
    		screenWidth,
    		$page,
    		show,
    		navigation_items,
    		menu_mode,
    		onClick,
    		onwindowresize,
    		menulinks_page_binding,
    		click_handler,
    		myaccount_show_binding,
    		menu_mode_binding,
    		menu_show_binding
    	];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.48.0 */
    const file$s = "src\\Components\\Footer.svelte";

    function create_fragment$v(ctx) {
    	let footer;
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let logo;
    	let current;
    	logo = new Logo({ props: { size: 'S' }, $$inline: true });

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Copyright © 2022";
    			t1 = space();
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			add_location(p, file$s, 6, 2, 124);
    			add_location(div0, file$s, 8, 2, 158);
    			attr_dev(div1, "class", "footer-container w3-padding svelte-hbytqh");
    			add_location(div1, file$s, 5, 1, 79);
    			attr_dev(footer, "class", " svelte-hbytqh");
    			add_location(footer, file$s, 4, 0, 59);
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\Layouts\Private.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file$r = "src\\Layouts\\Private.svelte";

    // (37:2) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(37:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:2) {#if $isLoading}
    function create_if_block$8(ctx) {
    	let div;
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
    			div = element("div");
    			create_component(loader.$$.fragment);
    			attr_dev(div, "class", "center-content");
    			add_location(div, file$r, 33, 3, 747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loader, div, null);
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
    			if (detaching) detach_dev(div);
    			destroy_component(loader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(33:2) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div1;
    	let navbar;
    	let t0;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;
    	navbar = new NavBar({ $$inline: true });
    	const if_block_creators = [create_if_block$8, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLoading*/ ctx[3]) return 0;
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
    			attr_dev(div0, "class", "main svelte-11plrck");
    			add_location(div0, file$r, 31, 1, 704);
    			attr_dev(div1, "style", /*Style*/ ctx[2]);
    			add_location(div1, file$r, 29, 0, 669);
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

    			if (!current || dirty & /*Style*/ 4) {
    				attr_dev(div1, "style", /*Style*/ ctx[2]);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let styles;
    	let Style;
    	let $text_color;
    	let $secondary_color;
    	let $primary_color;
    	let $user;
    	let $theme;
    	let $isLoading;
    	validate_store(text_color, 'text_color');
    	component_subscribe($$self, text_color, $$value => $$invalidate(5, $text_color = $$value));
    	validate_store(secondary_color, 'secondary_color');
    	component_subscribe($$self, secondary_color, $$value => $$invalidate(0, $secondary_color = $$value));
    	validate_store(primary_color, 'primary_color');
    	component_subscribe($$self, primary_color, $$value => $$invalidate(1, $primary_color = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(8, $user = $$value));
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(9, $theme = $$value));
    	validate_store(isLoading, 'isLoading');
    	component_subscribe($$self, isLoading, $$value => $$invalidate(3, $isLoading = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Private', slots, ['default']);
    	set_store_value(theme, $theme = localStorage.getItem($user._id) || 'default', $theme);
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Private> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		NavBar,
    		Footer,
    		Loader,
    		primary_color,
    		secondary_color,
    		text_color,
    		isLoading,
    		theme,
    		user,
    		styles,
    		Style,
    		$text_color,
    		$secondary_color,
    		$primary_color,
    		$user,
    		$theme,
    		$isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(4, styles = $$props.styles);
    		if ('Style' in $$props) $$invalidate(2, Style = $$props.Style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$primary_color, $secondary_color, $text_color*/ 35) {
    			$$invalidate(4, styles = {
    				'primary-color': $primary_color,
    				'secondary-color': $secondary_color,
    				'text-color': $text_color,
    				font: '"Gluten", cursive'
    			});
    		}

    		if ($$self.$$.dirty & /*styles*/ 16) {
    			$$invalidate(2, Style = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';'));
    		}
    	};

    	return [
    		$secondary_color,
    		$primary_color,
    		Style,
    		$isLoading,
    		styles,
    		$text_color,
    		$$scope,
    		slots
    	];
    }

    class Private extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Private",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\Routes\Guard\PrivateRouteGuard.svelte generated by Svelte v3.48.0 */

    // (5:0) {#if $loggedIn}
    function create_if_block$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(5:0) {#if $loggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$loggedIn*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
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
    			if (/*$loggedIn*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$loggedIn*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
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
    	let $loggedIn;
    	validate_store(loggedIn, 'loggedIn');
    	component_subscribe($$self, loggedIn, $$value => $$invalidate(0, $loggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivateRouteGuard', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivateRouteGuard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ loggedIn, $loggedIn });
    	return [$loggedIn, $$scope, slots];
    }

    class PrivateRouteGuard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivateRouteGuard",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\Routes\Guard\PrivateRoute.svelte generated by Svelte v3.48.0 */

    // (10:1) <PrivateRouteGuard>
    function create_default_slot_1$3(ctx) {
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
    			switch_instance_anchor = empty$1();
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(10:1) <PrivateRouteGuard>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Route {path} let:params let:location let:navigate>
    function create_default_slot$g(ctx) {
    	let privaterouteguard;
    	let current;

    	privaterouteguard = new PrivateRouteGuard({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(privaterouteguard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(privaterouteguard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const privaterouteguard_changes = {};

    			if (dirty & /*$$scope, component*/ 34) {
    				privaterouteguard_changes.$$scope = { dirty, ctx };
    			}

    			privaterouteguard.$set(privaterouteguard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(privaterouteguard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(privaterouteguard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(privaterouteguard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(9:0) <Route {path} let:params let:location let:navigate>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let route;
    	let current;

    	route = new Route$1({
    			props: {
    				path: /*path*/ ctx[0],
    				$$slots: {
    					default: [
    						create_default_slot$g,
    						({ params, location, navigate }) => ({ 2: params, 3: location, 4: navigate }),
    						({ params, location, navigate }) => (params ? 4 : 0) | (location ? 8 : 0) | (navigate ? 16 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*path*/ 1) route_changes.path = /*path*/ ctx[0];

    			if (dirty & /*$$scope, component*/ 34) {
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivateRoute', slots, []);
    	let { path } = $$props;
    	let { component } = $$props;
    	const writable_props = ['path', 'component'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivateRoute> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    	};

    	$$self.$capture_state = () => ({
    		Route: Route$1,
    		PrivateRouteGuard,
    		path,
    		component
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [path, component];
    }

    class PrivateRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { path: 0, component: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivateRoute",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*path*/ ctx[0] === undefined && !('path' in props)) {
    			console.warn("<PrivateRoute> was created without expected prop 'path'");
    		}

    		if (/*component*/ ctx[1] === undefined && !('component' in props)) {
    			console.warn("<PrivateRoute> was created without expected prop 'component'");
    		}
    	}

    	get path() {
    		throw new Error("<PrivateRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<PrivateRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<PrivateRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<PrivateRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * weeknumber
     * @author commenthol
     * @license Unlicense
     */

    const MINUTE = 60000;
    const WEEK = 604800000; // = 7 * 24 * 60 * 60 * 1000 = 7 days in ms

    /**
     * Get the difference in milliseconds between the timezone offsets of 2 dates
     */
    const tzDiff = (first, second) => (first.getTimezoneOffset() - second.getTimezoneOffset()) * MINUTE;

    /**
     * ISO 8601 week numbering.
     *
     * New week starts on mondays.
     * Used by most European countries, most of Asia and Oceania.
     *
     * 1st week contains 4-7 days of the new year
     * @param {Date} [date] - local date
     * @return {number} week number in ISO 8601 format
     * @example
     * weekNumber(new Date(2016, 0, 3, 12)) // Sun
     * //> 53
     * weekNumber(new Date(2016, 0, 4, 12)) // Mon
     * //> 1
     */
    const weekNumber = (date = new Date()) => {
      // day 0 is monday
      const day = (date.getDay() + 6) % 7;
      // get thursday of present week
      const thursday = new Date(date);
      thursday.setDate(date.getDate() - day + 3);
      // set 1st january first
      const firstThursday = new Date(thursday.getFullYear(), 0, 1);
      // if Jan 1st is not a thursday...
      if (firstThursday.getDay() !== 4) {
        firstThursday.setMonth(0, 1 + (11 /* 4 + 7 */ - firstThursday.getDay()) % 7);
      }
      const weekNumber = 1 + Math.floor((thursday - firstThursday + tzDiff(firstThursday, thursday)) / WEEK);
      return weekNumber
    };

    const getDay = (dayNum) => {
    	switch (dayNum) {
    		case 0:
    			return 'Søndag';
    		case 1:
    			return 'Mandag';
    		case 2:
    			return 'Tirsdag';
    		case 3:
    			return 'Onsdag';
    		case 4:
    			return 'Torsdag';
    		case 5:
    			return 'Fredag';
    		case 6:
    			return 'Lørdag';
    		default:
    			return 'ukendt';
    	}
    };
    const getMonth = (monthNum) => {
    	switch (monthNum) {
    		case 0:
    			return 'Januar';
    		case 1:
    			return 'Februar';
    		case 2:
    			return 'Marts';
    		case 3:
    			return 'April';
    		case 4:
    			return 'Maj';
    		case 5:
    			return 'Juni';
    		case 6:
    			return 'Juli';
    		case 7:
    			return 'August';
    		case 8:
    			return 'September';
    		case 9:
    			return 'Oktober';
    		case 10:
    			return 'November';
    		case 11:
    			return 'December';
    		default:
    			return 'ukendt';
    	}
    };

    /* node_modules\svelte-icons\md\MdAddBox.svelte generated by Svelte v3.48.0 */
    const file$q = "node_modules\\svelte-icons\\md\\MdAddBox.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$f(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z");
    			add_location(path, file$q, 4, 10, 151);
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

    function create_fragment$r(ctx) {
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MdAddBox', slots, []);

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

    class MdAddBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MdAddBox",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* node_modules\svelte-icons\md\MdSend.svelte generated by Svelte v3.48.0 */
    const file$p = "node_modules\\svelte-icons\\md\\MdSend.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$e(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z");
    			add_location(path, file$p, 4, 10, 151);
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

    function create_fragment$q(ctx) {
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MdSend', slots, []);

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

    class MdSend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MdSend",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\Private\Home.svelte generated by Svelte v3.48.0 */
    const file$o = "src\\Private\\Home.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (110:5) {:else}
    function create_else_block_1$3(ctx) {
    	let div1;
    	let div0;
    	let mdaddbox;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	mdaddbox = new MdAddBox({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(mdaddbox.$$.fragment);
    			t = text("\r\n\t\t\t\t\t\t\tNyt Opslag");
    			attr_dev(div0, "class", "icon-small ");
    			add_location(div0, file$o, 111, 7, 2996);
    			attr_dev(div1, "class", "flex-align icon");
    			add_location(div1, file$o, 110, 6, 2920);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(mdaddbox, div0, null);
    			append_dev(div1, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler_1*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mdaddbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mdaddbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(mdaddbox);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(110:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:5) {#if newPost}
    function create_if_block_3$1(ctx) {
    	let div2;
    	let button;
    	let t1;
    	let div1;
    	let t2;
    	let div0;
    	let mdsend;
    	let current;
    	let mounted;
    	let dispose;
    	mdsend = new MdSend({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Fortryd";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Slå op\r\n\t\t\t\t\t\t\t\t");
    			div0 = element("div");
    			create_component(mdsend.$$.fragment);
    			attr_dev(button, "class", "button");
    			set_style(button, "width", `50%`, false);
    			add_location(button, file$o, 92, 7, 2517);
    			attr_dev(div0, "class", "icon-small ");
    			add_location(div0, file$o, 104, 8, 2807);
    			attr_dev(div1, "class", "flex-align icon svelte-1unzlj9");
    			toggle_class(div1, "disabled", /*postContent*/ ctx[0].length < 10);
    			add_location(div1, file$o, 98, 7, 2659);
    			attr_dev(div2, "class", "flex-align");
    			set_style(div2, "width", `25%`, false);
    			add_location(div2, file$o, 91, 6, 2466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(mdsend, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(div1, "click", /*post*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*postContent*/ 1) {
    				toggle_class(div1, "disabled", /*postContent*/ ctx[0].length < 10);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mdsend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mdsend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(mdsend);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(91:5) {#if newPost}",
    		ctx
    	});

    	return block;
    }

    // (121:3) {#if newPost}
    function create_if_block_2$3(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div3;
    	let input;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("Tegn:");
    			t1 = text(/*postLength*/ ctx[4]);
    			t2 = space();
    			div3 = element("div");
    			input = element("input");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			div2 = element("div");
    			textarea = element("textarea");
    			add_location(div0, file$o, 121, 4, 3179);
    			attr_dev(input, "placeholder", "Title");
    			attr_dev(input, "class", "flex-align");
    			add_location(input, file$o, 125, 5, 3263);
    			attr_dev(div1, "class", "divider");
    			add_location(div1, file$o, 126, 5, 3341);
    			attr_dev(textarea, "class", "newPost svelte-1unzlj9");
    			attr_dev(textarea, "placeholder", "Du ska have mindst 10 tegn for at oprette et opslag");
    			add_location(textarea, file$o, 128, 6, 3403);
    			attr_dev(div2, "class", "flex-align");
    			add_location(div2, file$o, 127, 5, 3371);
    			attr_dev(div3, "class", "grid-full-column");
    			add_location(div3, file$o, 124, 4, 3226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input);
    			set_input_value(input, /*postTitle*/ ctx[2]);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, textarea);
    			set_input_value(textarea, /*postContent*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[13]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[14])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*postLength*/ 16) set_data_dev(t1, /*postLength*/ ctx[4]);

    			if (dirty & /*postTitle*/ 4 && input.value !== /*postTitle*/ ctx[2]) {
    				set_input_value(input, /*postTitle*/ ctx[2]);
    			}

    			if (dirty & /*postContent*/ 1) {
    				set_input_value(textarea, /*postContent*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(121:3) {#if newPost}",
    		ctx
    	});

    	return block;
    }

    // (167:3) {:else}
    function create_else_block$5(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Kom i gang med det første opslag";
    			add_location(h3, file$o, 167, 4, 4467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(167:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (137:3) {#if posts.length > 0}
    function create_if_block$6(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*posts*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*post*/ ctx[10]._id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts, deletePost, $user, Date*/ 552) {
    				each_value = /*posts*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    				check_outros();
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(137:3) {#if posts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (149:8) {#if $user._id === post.createdBy}
    function create_if_block_1$5(ctx) {
    	let div;
    	let ioiosclose;
    	let current;
    	let mounted;
    	let dispose;
    	ioiosclose = new IoIosClose({ $$inline: true });

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[15](/*post*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(ioiosclose.$$.fragment);
    			attr_dev(div, "class", "delete icon-medium delete-icon svelte-1unzlj9");
    			add_location(div, file$o, 149, 9, 4055);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(ioiosclose, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(149:8) {#if $user._id === post.createdBy}",
    		ctx
    	});

    	return block;
    }

    // (138:4) {#each posts as post (post._id)}
    function create_each_block$3(key_1, ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let b;
    	let t0_value = /*post*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let small;
    	let t2_value = new Date(/*post*/ ctx[10].createdAt).toLocaleDateString() + "";
    	let t2;
    	let t3;
    	let t4_value = new Date(/*post*/ ctx[10].createdAt).toLocaleTimeString() + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let h4;
    	let t7_value = /*post*/ ctx[10].title + "";
    	let t7;
    	let t8;
    	let q;
    	let t9_value = /*post*/ ctx[10].content + "";
    	let t9;
    	let t10;
    	let hr;
    	let t11;
    	let current;
    	let if_block = /*$user*/ ctx[5]._id === /*post*/ ctx[10].createdBy && create_if_block_1$5(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t6 = space();
    			h4 = element("h4");
    			t7 = text(t7_value);
    			t8 = space();
    			q = element("q");
    			t9 = text(t9_value);
    			t10 = space();
    			hr = element("hr");
    			t11 = space();
    			attr_dev(b, "class", "info-text");
    			add_location(b, file$o, 141, 8, 3784);
    			add_location(small, file$o, 142, 8, 3830);
    			add_location(div0, file$o, 140, 7, 3769);
    			add_location(div1, file$o, 147, 7, 3995);
    			attr_dev(div2, "class", "grid-full-column flex-align");
    			add_location(div2, file$o, 139, 6, 3719);
    			attr_dev(h4, "class", "grid-full-column");
    			add_location(h4, file$o, 159, 6, 4267);
    			attr_dev(q, "class", "grid-full-column");
    			add_location(q, file$o, 160, 6, 4321);
    			attr_dev(hr, "class", "grid-full-column");
    			add_location(hr, file$o, 163, 6, 4392);
    			attr_dev(div3, "class", "grid-container grid-full-column post svelte-1unzlj9");
    			add_location(div3, file$o, 138, 5, 3661);
    			this.first = div3;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, b);
    			append_dev(b, t0);
    			append_dev(div0, t1);
    			append_dev(div0, small);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div3, t6);
    			append_dev(div3, h4);
    			append_dev(h4, t7);
    			append_dev(div3, t8);
    			append_dev(div3, q);
    			append_dev(q, t9);
    			append_dev(div3, t10);
    			append_dev(div3, hr);
    			append_dev(div3, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*posts*/ 8) && t0_value !== (t0_value = /*post*/ ctx[10].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*posts*/ 8) && t2_value !== (t2_value = new Date(/*post*/ ctx[10].createdAt).toLocaleDateString() + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*posts*/ 8) && t4_value !== (t4_value = new Date(/*post*/ ctx[10].createdAt).toLocaleTimeString() + "")) set_data_dev(t4, t4_value);

    			if (/*$user*/ ctx[5]._id === /*post*/ ctx[10].createdBy) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$user, posts*/ 40) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*posts*/ 8) && t7_value !== (t7_value = /*post*/ ctx[10].title + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*posts*/ 8) && t9_value !== (t9_value = /*post*/ ctx[10].content + "")) set_data_dev(t9, t9_value);
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
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(138:4) {#each posts as post (post._id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div0;
    	let h10;
    	let div0_intro;
    	let t1;
    	let div3;
    	let div1;
    	let h11;
    	let t4;
    	let h3;
    	let t12;
    	let div2;
    	let t13;
    	let div11;
    	let div4;
    	let p0;
    	let t15;
    	let div5;
    	let h12;
    	let t17;
    	let div10;
    	let div9;
    	let div8;
    	let div6;
    	let p1;
    	let t19;
    	let current_block_type_index;
    	let if_block0;
    	let t20;
    	let div7;
    	let t21;
    	let t22;
    	let current_block_type_index_1;
    	let if_block2;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_else_block_1$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*newPost*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*newPost*/ ctx[1] && create_if_block_2$3(ctx);
    	const if_block_creators_1 = [create_if_block$6, create_else_block$5];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*posts*/ ctx[3].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Hjem";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = `Uge ${/*week*/ ctx[6]}`;
    			t4 = space();
    			h3 = element("h3");

    			h3.textContent = `${/*day*/ ctx[8]} 
			${new Date().getDate()}. ${/*month*/ ctx[7]} 
			${new Date().getFullYear()}`;

    			t12 = space();
    			div2 = element("div");
    			t13 = space();
    			div11 = element("div");
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Du har ingen vagter i dag";
    			t15 = space();
    			div5 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Vagter";
    			t17 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div6 = element("div");
    			p1 = element("p");
    			p1.textContent = "Opslag";
    			t19 = space();
    			if_block0.c();
    			t20 = space();
    			div7 = element("div");
    			t21 = space();
    			if (if_block1) if_block1.c();
    			t22 = space();
    			if_block2.c();
    			add_location(h10, file$o, 64, 1, 1812);
    			attr_dev(div0, "class", "header flex-align");
    			add_location(div0, file$o, 63, 0, 1769);
    			add_location(h11, file$o, 68, 2, 1890);
    			attr_dev(h3, "class", "undertitle");
    			add_location(h3, file$o, 69, 2, 1913);
    			attr_dev(div1, "class", "flex-align");
    			add_location(div1, file$o, 67, 1, 1862);
    			attr_dev(div2, "class", "divider");
    			add_location(div2, file$o, 75, 1, 2034);
    			attr_dev(div3, "class", "container svelte-1unzlj9");
    			add_location(div3, file$o, 66, 0, 1835);
    			add_location(p0, file$o, 80, 2, 2163);
    			attr_dev(div4, "class", "center-container container svelte-1unzlj9");
    			add_location(div4, file$o, 79, 1, 2119);
    			add_location(h12, file$o, 83, 2, 2252);
    			attr_dev(div5, "class", "center-container container  svelte-1unzlj9");
    			add_location(div5, file$o, 82, 1, 2207);
    			attr_dev(p1, "class", "undertitle");
    			add_location(p1, file$o, 89, 5, 2406);
    			attr_dev(div6, "class", "flex-align");
    			add_location(div6, file$o, 88, 4, 2375);
    			attr_dev(div7, "class", "divider");
    			add_location(div7, file$o, 118, 4, 3121);
    			attr_dev(div8, "class", "grid-full-column");
    			add_location(div8, file$o, 87, 3, 2339);
    			attr_dev(div9, "class", "grid-container");
    			add_location(div9, file$o, 86, 2, 2306);
    			attr_dev(div10, "class", "container svelte-1unzlj9");
    			add_location(div10, file$o, 85, 1, 2279);
    			attr_dev(div11, "class", "content-container flex-container ");
    			add_location(div11, file$o, 78, 0, 2069);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h10);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t4);
    			append_dev(div1, h3);
    			append_dev(div3, t12);
    			append_dev(div3, div2);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div4);
    			append_dev(div4, p0);
    			append_dev(div11, t15);
    			append_dev(div11, div5);
    			append_dev(div5, h12);
    			append_dev(div11, t17);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, p1);
    			append_dev(div6, t19);
    			if_blocks[current_block_type_index].m(div6, null);
    			append_dev(div8, t20);
    			append_dev(div8, div7);
    			append_dev(div9, t21);
    			if (if_block1) if_block1.m(div9, null);
    			append_dev(div9, t22);
    			if_blocks_1[current_block_type_index_1].m(div9, null);
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
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div6, null);
    			}

    			if (/*newPost*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(div9, t22);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
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
    				if_block2 = if_blocks_1[current_block_type_index_1];

    				if (!if_block2) {
    					if_block2 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div9, null);
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

    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div11);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if_blocks_1[current_block_type_index_1].d();
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
    	let postLength;
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const week = weekNumber(new Date());
    	const month = getMonth(new Date().getMonth());
    	const day = getDay(new Date().getDay());
    	let newPost = false;
    	let postContent = '';
    	let postTitle = '';
    	const posts = [];

    	onMount(async () => {
    		await fetchPosts();
    	});

    	async function fetchPosts() {
    		const { payload } = await apiGet(GET_POSTS());

    		if (payload) {
    			const nonSortedPosts = payload.posts;

    			const sortedPosts = nonSortedPosts.sort(function (a, b) {
    				return b.createdAt - a.createdAt;
    			});

    			$$invalidate(3, posts = sortedPosts);
    		}
    	}

    	async function post() {
    		const { error, payload } = await apiPost(POST_POST(), { title: postTitle, content: postContent });

    		if (payload) {
    			$$invalidate(2, postTitle = '');
    			$$invalidate(0, postContent = '');
    			$$invalidate(1, newPost = false);
    			await fetchPosts();
    		} else {
    			notifyError$1(error.message);
    		}
    	}

    	async function deletePost(postId) {
    		const { error, payload } = await apiDelete(DELETE_POST(postId));

    		if (payload) {
    			if (posts.length <= 1) {
    				$$invalidate(3, posts = []);
    			} else await fetchPosts();
    		} else notifyError$1(error.message);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, newPost = !newPost);
    	const click_handler_1 = () => $$invalidate(1, newPost = !newPost);

    	function input_input_handler() {
    		postTitle = this.value;
    		$$invalidate(2, postTitle);
    	}

    	function textarea_input_handler() {
    		postContent = this.value;
    		$$invalidate(0, postContent);
    	}

    	const click_handler_2 = post => deletePost(post._id);

    	$$self.$capture_state = () => ({
    		fade,
    		slide,
    		fly,
    		scale,
    		weekNumber,
    		getDay,
    		getMonth,
    		MdAddBox,
    		MdSend,
    		IoIosClose,
    		onMount,
    		apiGet,
    		apiPost,
    		apiDelete,
    		POST_POST,
    		GET_POSTS,
    		DELETE_POST,
    		notifyError: notifyError$1,
    		user,
    		week,
    		month,
    		day,
    		newPost,
    		postContent,
    		postTitle,
    		posts,
    		fetchPosts,
    		post,
    		deletePost,
    		postLength,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('newPost' in $$props) $$invalidate(1, newPost = $$props.newPost);
    		if ('postContent' in $$props) $$invalidate(0, postContent = $$props.postContent);
    		if ('postTitle' in $$props) $$invalidate(2, postTitle = $$props.postTitle);
    		if ('postLength' in $$props) $$invalidate(4, postLength = $$props.postLength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*postContent*/ 1) {
    			$$invalidate(4, postLength = postContent.length);
    		}
    	};

    	return [
    		postContent,
    		newPost,
    		postTitle,
    		posts,
    		postLength,
    		$user,
    		week,
    		month,
    		day,
    		deletePost,
    		post,
    		click_handler,
    		click_handler_1,
    		input_input_handler,
    		textarea_input_handler,
    		click_handler_2
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\Private\Schedule.svelte generated by Svelte v3.48.0 */
    const file$n = "src\\Private\\Schedule.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Vagtplan";
    			add_location(h1, file$n, 5, 1, 118);
    			attr_dev(div, "class", "header");
    			add_location(div, file$n, 4, 0, 86);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Schedule",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\Private\Messages.svelte generated by Svelte v3.48.0 */
    const file$m = "src\\Private\\Messages.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let h1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Beskeder";
    			add_location(h1, file$m, 5, 1, 105);
    			attr_dev(div, "class", "header");
    			add_location(div, file$m, 4, 0, 73);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\Components\Table\Thead.svelte generated by Svelte v3.48.0 */

    const file$l = "src\\Components\\Table\\Thead.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each titles as title}
    function create_each_block$2(ctx) {
    	let th;
    	let t_value = /*title*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-1yoryb0");
    			add_location(th, file$l, 7, 3, 107);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*titles*/ 1 && t_value !== (t_value = /*title*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:2) {#each titles as title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let thead;
    	let tr;
    	let t;
    	let th;
    	let each_value = /*titles*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			th = element("th");
    			attr_dev(th, "class", "svelte-1yoryb0");
    			add_location(th, file$l, 9, 2, 138);
    			attr_dev(tr, "class", "svelte-1yoryb0");
    			add_location(tr, file$l, 5, 1, 71);
    			attr_dev(thead, "class", "w3-white");
    			add_location(thead, file$l, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			append_dev(tr, th);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*titles*/ 1) {
    				each_value = /*titles*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Thead', slots, []);
    	let { titles } = $$props;
    	const writable_props = ['titles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    	};

    	$$self.$capture_state = () => ({ titles });

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [titles];
    }

    class Thead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { titles: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thead",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*titles*/ ctx[0] === undefined && !('titles' in props)) {
    			console.warn("<Thead> was created without expected prop 'titles'");
    		}
    	}

    	get titles() {
    		throw new Error("<Thead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titles(value) {
    		throw new Error("<Thead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-icons\fa\FaUserEdit.svelte generated by Svelte v3.48.0 */
    const file$k = "node_modules\\svelte-icons\\fa\\FaUserEdit.svelte";

    // (4:8) <IconBase viewBox="0 0 640 512" {...$$props}>
    function create_default_slot$d(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9 1.2-11.1 7.9-7.9 77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z");
    			add_location(path, file$k, 4, 10, 153);
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
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 640 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 640 512" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaUserEdit', slots, []);

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

    class FaUserEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaUserEdit",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* node_modules\svelte-icons\fa\FaUserMinus.svelte generated by Svelte v3.48.0 */
    const file$j = "node_modules\\svelte-icons\\fa\\FaUserMinus.svelte";

    // (4:8) <IconBase viewBox="0 0 640 512" {...$$props}>
    function create_default_slot$c(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M624 208H432c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z");
    			add_location(path, file$j, 4, 10, 153);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 640 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 640 512" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaUserMinus', slots, []);

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

    class FaUserMinus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaUserMinus",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\Components\Table\Tbody.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\Components\\Table\\Tbody.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (19:1) {#each list as item}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let img;
    	let img_src_value;
    	let t0;
    	let td1;
    	let t1_value = /*item*/ ctx[5].name + "";
    	let t1;
    	let t2;
    	let td2;
    	let t3_value = /*item*/ ctx[5].phone + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5_value = /*item*/ ctx[5].position + "";
    	let t5;
    	let t6;
    	let td4;
    	let div1;
    	let div0;
    	let fauserminus;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;
    	fauserminus = new FaUserMinus({ $$inline: true });

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*item*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			img = element("img");
    			t0 = space();
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fauserminus.$$.fragment);
    			t7 = space();
    			attr_dev(img, "class", "w3-image w3-circle w3-hide-small svelte-3k56ma");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[5].pb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "profile");
    			add_location(img, file$i, 21, 5, 483);
    			attr_dev(td0, "class", "svelte-3k56ma");
    			add_location(td0, file$i, 20, 3, 473);
    			attr_dev(td1, "class", "svelte-3k56ma");
    			add_location(td1, file$i, 27, 3, 597);
    			attr_dev(td2, "class", "svelte-3k56ma");
    			add_location(td2, file$i, 28, 3, 622);
    			attr_dev(td3, "class", "svelte-3k56ma");
    			add_location(td3, file$i, 29, 3, 648);
    			attr_dev(div0, "class", "delete-icon icon-small");
    			add_location(div0, file$i, 32, 5, 699);
    			add_location(div1, file$i, 31, 4, 687);
    			attr_dev(td4, "class", "svelte-3k56ma");
    			add_location(td4, file$i, 30, 3, 677);
    			attr_dev(tr, "class", "w3-card svelte-3k56ma");
    			add_location(tr, file$i, 19, 2, 448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, img);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, div1);
    			append_dev(div1, div0);
    			mount_component(fauserminus, div0, null);
    			append_dev(tr, t7);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fauserminus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fauserminus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(fauserminus);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:1) {#each list as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let tbody;
    	let current;
    	let each_value = /*list*/ ctx[1];
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
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tbody, "class", "w3-white");
    			add_location(tbody, file$i, 17, 0, 397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*onDelete, list*/ 3) {
    				each_value = /*list*/ ctx[1];
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
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
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
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Tbody', slots, []);
    	let { data } = $$props;
    	let { info } = $$props;
    	let { onDelete } = $$props;

    	let list = info.map(i => ({
    		id: i._id,
    		pb: i.pb,
    		name: `${i.firstname} ${i.lastname}`,
    		phone: i.phone,
    		position: data.find(e => e._id === e._id).position
    	}));

    	const writable_props = ['data', 'info', 'onDelete'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tbody> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => onDelete(item.id, item.name);

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('info' in $$props) $$invalidate(3, info = $$props.info);
    		if ('onDelete' in $$props) $$invalidate(0, onDelete = $$props.onDelete);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		info,
    		onDelete,
    		FaUserEdit,
    		FaUserMinus,
    		list
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('info' in $$props) $$invalidate(3, info = $$props.info);
    		if ('onDelete' in $$props) $$invalidate(0, onDelete = $$props.onDelete);
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onDelete, list, data, info, click_handler];
    }

    class Tbody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { data: 2, info: 3, onDelete: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tbody",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<Tbody> was created without expected prop 'data'");
    		}

    		if (/*info*/ ctx[3] === undefined && !('info' in props)) {
    			console.warn("<Tbody> was created without expected prop 'info'");
    		}

    		if (/*onDelete*/ ctx[0] === undefined && !('onDelete' in props)) {
    			console.warn("<Tbody> was created without expected prop 'onDelete'");
    		}
    	}

    	get data() {
    		throw new Error("<Tbody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Tbody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Tbody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Tbody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDelete() {
    		throw new Error("<Tbody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDelete(value) {
    		throw new Error("<Tbody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Table.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\Components\\Table.svelte";

    function create_fragment$i(ctx) {
    	let table;
    	let thead;
    	let t;
    	let tbody;
    	let current;

    	thead = new Thead({
    			props: { titles: /*titles*/ ctx[0] },
    			$$inline: true
    		});

    	tbody = new Tbody({
    			props: {
    				data: /*data*/ ctx[1],
    				info: /*info*/ ctx[2],
    				onDelete: /*onDelete*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			table = element("table");
    			create_component(thead.$$.fragment);
    			t = space();
    			create_component(tbody.$$.fragment);
    			attr_dev(table, "class", "svelte-1cwl9bq");
    			add_location(table, file$h, 11, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			mount_component(thead, table, null);
    			append_dev(table, t);
    			mount_component(tbody, table, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const thead_changes = {};
    			if (dirty & /*titles*/ 1) thead_changes.titles = /*titles*/ ctx[0];
    			thead.$set(thead_changes);
    			const tbody_changes = {};
    			if (dirty & /*data*/ 2) tbody_changes.data = /*data*/ ctx[1];
    			if (dirty & /*info*/ 4) tbody_changes.info = /*info*/ ctx[2];
    			if (dirty & /*onDelete*/ 8) tbody_changes.onDelete = /*onDelete*/ ctx[3];
    			tbody.$set(tbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thead.$$.fragment, local);
    			transition_in(tbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thead.$$.fragment, local);
    			transition_out(tbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_component(thead);
    			destroy_component(tbody);
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
    	validate_slots('Table', slots, []);
    	let { titles } = $$props;
    	let { data } = $$props;
    	let { info } = $$props;
    	let { onDelete } = $$props;
    	const writable_props = ['titles', 'data', 'info', 'onDelete'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('info' in $$props) $$invalidate(2, info = $$props.info);
    		if ('onDelete' in $$props) $$invalidate(3, onDelete = $$props.onDelete);
    	};

    	$$self.$capture_state = () => ({
    		Thead,
    		Tbody,
    		titles,
    		data,
    		info,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('info' in $$props) $$invalidate(2, info = $$props.info);
    		if ('onDelete' in $$props) $$invalidate(3, onDelete = $$props.onDelete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [titles, data, info, onDelete];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { titles: 0, data: 1, info: 2, onDelete: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*titles*/ ctx[0] === undefined && !('titles' in props)) {
    			console.warn("<Table> was created without expected prop 'titles'");
    		}

    		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
    			console.warn("<Table> was created without expected prop 'data'");
    		}

    		if (/*info*/ ctx[2] === undefined && !('info' in props)) {
    			console.warn("<Table> was created without expected prop 'info'");
    		}

    		if (/*onDelete*/ ctx[3] === undefined && !('onDelete' in props)) {
    			console.warn("<Table> was created without expected prop 'onDelete'");
    		}
    	}

    	get titles() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titles(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDelete() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDelete(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Private\Employee\Overview.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\Private\\Employee\\Overview.svelte";

    // (69:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				titles: /*titles*/ ctx[7],
    				info: /*info*/ ctx[1],
    				data: /*employees*/ ctx[0],
    				onDelete: /*confirmDelete*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(table.$$.fragment);
    			attr_dev(div, "class", "table svelte-ialn0o");
    			add_location(div, file$g, 69, 1, 1726);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(table, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty & /*info*/ 2) table_changes.info = /*info*/ ctx[1];
    			if (dirty & /*employees*/ 1) table_changes.data = /*employees*/ ctx[0];
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(69:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:16) 
    function create_if_block_1$4(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Du har ingen registeret medarbejder";
    			add_location(p, file$g, 66, 2, 1663);
    			attr_dev(div, "class", "center-content");
    			add_location(div, file$g, 65, 1, 1631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(65:16) ",
    		ctx
    	});

    	return block;
    }

    // (61:0) {#if loading}
    function create_if_block$5(ctx) {
    	let div;
    	let loader;
    	let current;

    	loader = new Loader({
    			props: {
    				type: 'Jumper',
    				color: /*$secondary_color*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loader.$$.fragment);
    			attr_dev(div, "class", "center-content");
    			add_location(div, file$g, 61, 1, 1518);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loader, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loader_changes = {};
    			if (dirty & /*$secondary_color*/ 64) loader_changes.color = /*$secondary_color*/ ctx[6];
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
    			if (detaching) detach_dev(div);
    			destroy_component(loader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(61:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div5;
    	let div4;
    	let div0;
    	let h3;
    	let t2;
    	let div2;
    	let div1;
    	let p0;
    	let b0;
    	let t4;
    	let t5;
    	let br0;
    	let t6;
    	let p1;
    	let t7;
    	let b1;
    	let t8;
    	let t9;
    	let t10;
    	let br1;
    	let t11;
    	let b2;
    	let t13;
    	let div3;
    	let button0;
    	let t15;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[3]) return 0;
    		if (/*empty*/ ctx[2]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Bekræft sletning";
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			b0 = element("b");
    			b0.textContent = "Advarsel:";
    			t4 = text(" Denne handling kan ikke fortrydes");
    			t5 = space();
    			br0 = element("br");
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Du vil permanent fjerne ");
    			b1 = element("b");
    			t8 = text(/*employeeToBeDeletedName*/ ctx[4]);
    			t9 = text(" og alle associeret vagter,\r\n\t\t\t\topslag og beskeder");
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			b2 = element("b");
    			b2.textContent = "Er du sikker på du vil fortsætte?";
    			t13 = space();
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "Nej";
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = "Ja";
    			add_location(h3, file$g, 76, 3, 1986);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$g, 75, 2, 1955);
    			add_location(b0, file$g, 80, 7, 2068);
    			add_location(p0, file$g, 80, 4, 2065);
    			add_location(div1, file$g, 79, 3, 2054);
    			add_location(br0, file$g, 82, 3, 2138);
    			add_location(b1, file$g, 84, 28, 2182);
    			add_location(p1, file$g, 83, 3, 2149);
    			add_location(br1, file$g, 87, 3, 2279);
    			add_location(b2, file$g, 88, 3, 2290);
    			attr_dev(div2, "class", "modal-body");
    			add_location(div2, file$g, 78, 2, 2025);
    			attr_dev(button0, "class", "modal-button");
    			add_location(button0, file$g, 91, 3, 2375);
    			attr_dev(button1, "class", "modal-button");
    			set_style(button1, "color", `#fff`, false);
    			set_style(button1, "background-color", `red`, false);
    			add_location(button1, file$g, 94, 3, 2473);
    			attr_dev(div3, "class", "modal-footer");
    			add_location(div3, file$g, 90, 2, 2344);
    			attr_dev(div4, "class", "w3-modal-content w3-animate-zoom modal-container");
    			add_location(div4, file$g, 74, 1, 1889);
    			attr_dev(div5, "class", "w3-modal");
    			toggle_class(div5, "w3-show", /*deleteConfirm*/ ctx[5]);
    			add_location(div5, file$g, 73, 0, 1834);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h3);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, b0);
    			append_dev(p0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, br0);
    			append_dev(div2, t6);
    			append_dev(div2, p1);
    			append_dev(p1, t7);
    			append_dev(p1, b1);
    			append_dev(b1, t8);
    			append_dev(p1, t9);
    			append_dev(div2, t10);
    			append_dev(div2, br1);
    			append_dev(div2, t11);
    			append_dev(div2, b2);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t15);
    			append_dev(div3, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*deleteEmployee*/ ctx[9], false, false, false)
    				];

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
    				if_block.m(t0.parentNode, t0);
    			}

    			if (!current || dirty & /*employeeToBeDeletedName*/ 16) set_data_dev(t8, /*employeeToBeDeletedName*/ ctx[4]);

    			if (dirty & /*deleteConfirm*/ 32) {
    				toggle_class(div5, "w3-show", /*deleteConfirm*/ ctx[5]);
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
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
    	let $secondary_color;
    	validate_store(secondary_color, 'secondary_color');
    	component_subscribe($$self, secondary_color, $$value => $$invalidate(6, $secondary_color = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overview', slots, []);
    	let employees = [];
    	let info = [];
    	let titles = ['', 'Navn', 'Telefon', 'Stilling'];
    	let empty = true;
    	let loading = true;

    	onMount(async () => {
    		await fetchEmployees();
    	});

    	let employeeToBeDeletedId = '';
    	let employeeToBeDeletedName = '';
    	let deleteConfirm = false;

    	async function fetchEmployees() {
    		$$invalidate(3, loading = true);
    		const { payload, error } = await apiGet(GET_EMPLOYEES());

    		if (payload) {
    			$$invalidate(0, employees = payload.employees);
    			$$invalidate(1, info = payload.userInfo);
    			$$invalidate(2, empty = false);
    		} else {
    			$$invalidate(2, empty = true);
    		}

    		$$invalidate(3, loading = false);
    	}

    	function confirmDelete(id, name) {
    		employeeToBeDeletedId = id;
    		$$invalidate(4, employeeToBeDeletedName = name);
    		$$invalidate(5, deleteConfirm = true);
    	}

    	async function deleteEmployee() {
    		const { payload, error } = await apiDelete(DELETE_EMPLOYEE(employeeToBeDeletedId));

    		if (payload) {
    			notifySuccess(payload.message);
    			employeeToBeDeletedId = '';
    			$$invalidate(4, employeeToBeDeletedName = '');
    			$$invalidate(5, deleteConfirm = false);
    			await fetchEmployees();
    		} else notifyError$1(error.message);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(5, deleteConfirm = false);

    	$$self.$capture_state = () => ({
    		onMount,
    		Loader,
    		secondary_color,
    		primary_color,
    		apiGet,
    		apiDelete,
    		GET_EMPLOYEES,
    		DELETE_EMPLOYEE,
    		Table,
    		notifyError: notifyError$1,
    		notifySuccess,
    		employees,
    		info,
    		titles,
    		empty,
    		loading,
    		employeeToBeDeletedId,
    		employeeToBeDeletedName,
    		deleteConfirm,
    		fetchEmployees,
    		confirmDelete,
    		deleteEmployee,
    		$secondary_color
    	});

    	$$self.$inject_state = $$props => {
    		if ('employees' in $$props) $$invalidate(0, employees = $$props.employees);
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('titles' in $$props) $$invalidate(7, titles = $$props.titles);
    		if ('empty' in $$props) $$invalidate(2, empty = $$props.empty);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    		if ('employeeToBeDeletedId' in $$props) employeeToBeDeletedId = $$props.employeeToBeDeletedId;
    		if ('employeeToBeDeletedName' in $$props) $$invalidate(4, employeeToBeDeletedName = $$props.employeeToBeDeletedName);
    		if ('deleteConfirm' in $$props) $$invalidate(5, deleteConfirm = $$props.deleteConfirm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		employees,
    		info,
    		empty,
    		loading,
    		employeeToBeDeletedName,
    		deleteConfirm,
    		$secondary_color,
    		titles,
    		confirmDelete,
    		deleteEmployee,
    		click_handler
    	];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules\svelte-icons\md\MdContentCopy.svelte generated by Svelte v3.48.0 */
    const file$f = "node_modules\\svelte-icons\\md\\MdContentCopy.svelte";

    // (4:8) <IconBase viewBox="0 0 24 24" {...$$props}>
    function create_default_slot$b(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z");
    			add_location(path, file$f, 4, 10, 151);
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
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 24 24\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 24 24" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MdContentCopy', slots, []);

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

    class MdContentCopy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MdContentCopy",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules\svelte-clipboard\src\Clipboard.svelte generated by Svelte v3.48.0 */
    const file$e = "node_modules\\svelte-clipboard\\src\\Clipboard.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ copy: /*copy*/ ctx[2] });

    function create_fragment$f(ctx) {
    	let t;
    	let textarea_1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    			t = space();
    			textarea_1 = element("textarea");
    			textarea_1.value = /*text*/ ctx[0];
    			attr_dev(textarea_1, "class", "svelte-w8w2mp");
    			add_location(textarea_1, file$e, 34, 0, 537);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, textarea_1, anchor);
    			/*textarea_1_binding*/ ctx[5](textarea_1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*text*/ 1) {
    				prop_dev(textarea_1, "value", /*text*/ ctx[0]);
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
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(textarea_1);
    			/*textarea_1_binding*/ ctx[5](null);
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
    	validate_slots('Clipboard', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { text } = $$props;
    	let textarea;

    	async function copy() {
    		textarea.select();
    		document.execCommand("Copy");
    		await tick();
    		textarea.blur();
    		dispatch("copy");
    	}

    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Clipboard> was created with unknown prop '${key}'`);
    	});

    	function textarea_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textarea = $$value;
    			$$invalidate(1, textarea);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tick,
    		createEventDispatcher,
    		dispatch,
    		text,
    		textarea,
    		copy
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('textarea' in $$props) $$invalidate(1, textarea = $$props.textarea);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, textarea, copy, $$scope, slots, textarea_1_binding];
    }

    class Clipboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clipboard",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Clipboard> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Clipboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Clipboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Private\Employee\AddEmployee.svelte generated by Svelte v3.48.0 */

    const file$d = "src\\Private\\Employee\\AddEmployee.svelte";

    // (51:1) {#if token.length > 0}
    function create_if_block$4(ctx) {
    	let div0;
    	let clipboard;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	clipboard = new Clipboard({
    			props: {
    				text: /*token*/ ctx[1],
    				$$slots: {
    					default: [
    						create_default_slot$a,
    						({ copy }) => ({ 7: copy }),
    						({ copy }) => copy ? 128 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	clipboard.$on("copy", /*copy_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(clipboard.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text("Den genereret Token skal udleveres til din medarbejder, og bruges ved\r\n\t\t\toprettelse for at tilknytte ");
    			t2 = text(/*email*/ ctx[0]);
    			t3 = text(" til din virksomhed.");
    			attr_dev(div0, "class", "code-container w3-code w3-border w3-light-gray svelte-dvl7hs");
    			add_location(div0, file$d, 51, 2, 1431);
    			attr_dev(div1, "class", "w3-padding w3-border w3-pale-blue w3-card");
    			add_location(div1, file$d, 63, 2, 1751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(clipboard, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const clipboard_changes = {};
    			if (dirty & /*token*/ 2) clipboard_changes.text = /*token*/ ctx[1];

    			if (dirty & /*$$scope, token, copy*/ 386) {
    				clipboard_changes.$$scope = { dirty, ctx };
    			}

    			clipboard.$set(clipboard_changes);
    			if (!current || dirty & /*email*/ 1) set_data_dev(t2, /*email*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clipboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clipboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(clipboard);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(51:1) {#if token.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (53:3) <Clipboard      text={token}      let:copy      on:copy={() => notifyInfo('Token Kopieret')}     >
    function create_default_slot$a(ctx) {
    	let div0;
    	let mdcontentcopy;
    	let t0;
    	let div1;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	mdcontentcopy = new MdContentCopy({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(mdcontentcopy.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*token*/ ctx[1]);
    			attr_dev(div0, "class", "copy-icon  svelte-dvl7hs");
    			add_location(div0, file$d, 57, 4, 1600);
    			attr_dev(div1, "class", "w3-padding ");
    			add_location(div1, file$d, 58, 4, 1669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(mdcontentcopy, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div0,
    					"click",
    					function () {
    						if (is_function(/*copy*/ ctx[7])) /*copy*/ ctx[7].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*token*/ 2) set_data_dev(t1, /*token*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mdcontentcopy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mdcontentcopy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(mdcontentcopy);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(53:3) <Clipboard      text={token}      let:copy      on:copy={() => notifyInfo('Token Kopieret')}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let form;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let p0;
    	let t4;
    	let button0;
    	let t6;
    	let p1;
    	let t8;
    	let button1;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*token*/ ctx[1].length > 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			label = element("label");
    			label.textContent = "Indtast din medarbejders email";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Du kan vælge at generere en Token";
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "Genererer Token";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Eller vi sender en invitation til din medarbejder";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Send Invitation";
    			t10 = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "for", "email");
    			add_location(label, file$d, 36, 2, 969);
    			attr_dev(input, "id", "email");
    			attr_dev(input, "placeholder", "email");
    			attr_dev(input, "type", "email");
    			input.required = true;
    			add_location(input, file$d, 37, 2, 1030);
    			add_location(p0, file$d, 45, 2, 1140);
    			attr_dev(button0, "class", "button");
    			add_location(button0, file$d, 46, 2, 1184);
    			add_location(p1, file$d, 47, 2, 1259);
    			attr_dev(button1, "class", "button");
    			add_location(button1, file$d, 48, 2, 1319);
    			attr_dev(form, "class", "grid-container");
    			add_location(form, file$d, 35, 1, 911);
    			add_location(div, file$d, 34, 0, 903);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, label);
    			append_dev(form, t1);
    			append_dev(form, input);
    			set_input_value(input, /*email*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, p0);
    			append_dev(form, t4);
    			append_dev(form, button0);
    			append_dev(form, t6);
    			append_dev(form, p1);
    			append_dev(form, t8);
    			append_dev(form, button1);
    			append_dev(div, t10);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button0, "click", /*generateCode*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*sendInvitation*/ ctx[3], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input.value !== /*email*/ ctx[0]) {
    				set_input_value(input, /*email*/ ctx[0]);
    			}

    			if (/*token*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*token*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
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
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddEmployee', slots, []);
    	let email;
    	let token = '';

    	async function generateCode() {
    		if (email.length > 0) {
    			const { payload, error } = await apiGet(GET_INVITATION_TOKEN(email));

    			if (payload) {
    				$$invalidate(1, token = payload.token);
    			} else notifyError$1(error.message);
    		}
    	}

    	async function sendInvitation() {
    		if (email.length > 0) {
    			const { payload, error } = await apiPost(POST_INVITATION_TOKEN(email), {});

    			if (payload) {
    				$$invalidate(0, email = '');
    				notifySuccess(payload.message);
    			} else notifyError$1(error.message);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddEmployee> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	const copy_handler = () => notifyInfo('Token Kopieret');

    	$$self.$capture_state = () => ({
    		MdContentCopy,
    		Clipboard,
    		notifyError: notifyError$1,
    		notifyInfo,
    		notifySuccess,
    		apiGet,
    		apiPost,
    		GET_INVITATION_TOKEN,
    		POST_INVITATION_TOKEN,
    		email,
    		token,
    		generateCode,
    		sendInvitation
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('token' in $$props) $$invalidate(1, token = $$props.token);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		email,
    		token,
    		generateCode,
    		sendInvitation,
    		submit_handler,
    		input_input_handler,
    		copy_handler
    	];
    }

    class AddEmployee extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddEmployee",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\Private\Employee\EditEmployee.svelte generated by Svelte v3.48.0 */

    const file$c = "src\\Private\\Employee\\EditEmployee.svelte";

    function create_fragment$d(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*id*/ ctx[0]);
    			add_location(h1, file$c, 4, 0, 40);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) set_data_dev(t, /*id*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
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
    	validate_slots('EditEmployee', slots, []);
    	let { id } = $$props;
    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditEmployee> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({ id });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id];
    }

    class EditEmployee extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditEmployee",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<EditEmployee> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<EditEmployee>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<EditEmployee>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Private\Employees.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\Private\\Employees.svelte";

    // (42:2) <Route path="/">
    function create_default_slot_3$1(ctx) {
    	let div;
    	let overview;
    	let div_intro;
    	let current;
    	overview = new Overview({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(overview.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$b, 42, 3, 1054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(overview, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overview.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(overview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(42:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:2) <Route path="/register">
    function create_default_slot_2$1(ctx) {
    	let div;
    	let addemployee;
    	let div_intro;
    	let current;
    	addemployee = new AddEmployee({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(addemployee.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$b, 48, 3, 1160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(addemployee, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addemployee.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addemployee.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(addemployee);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(48:2) <Route path=\\\"/register\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:2) <Route path="/edit/:id" let:params>
    function create_default_slot_1$2(ctx) {
    	let div;
    	let editemployee;
    	let div_intro;
    	let current;

    	editemployee = new EditEmployee({
    			props: { id: /*params*/ ctx[2].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(editemployee.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$b, 53, 3, 1278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(editemployee, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const editemployee_changes = {};
    			if (dirty & /*params*/ 4) editemployee_changes.id = /*params*/ ctx[2].id;
    			editemployee.$set(editemployee_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editemployee.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editemployee.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(editemployee);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(53:2) <Route path=\\\"/edit/:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (41:1) <Router primary={false}>
    function create_default_slot$9(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/register",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/edit/:id",
    				$$slots: {
    					default: [
    						create_default_slot_1$2,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
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

    			if (dirty & /*$$scope*/ 8) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, params*/ 12) {
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
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(41:1) <Router primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div0;
    	let h1;
    	let div0_intro;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let div2;
    	let router;
    	let current;
    	let mounted;
    	let dispose;

    	router = new Router$1({
    			props: {
    				primary: false,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Medarbejder";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Oversigt";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Tilføj";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Søg";
    			t7 = space();
    			div2 = element("div");
    			create_component(router.$$.fragment);
    			add_location(h1, file$b, 16, 1, 495);
    			attr_dev(div0, "class", "header w3-card-4");
    			add_location(div0, file$b, 15, 0, 453);
    			attr_dev(a0, "href", "/employees/");
    			attr_dev(a0, "class", "tab-button");
    			toggle_class(a0, "active", /*$location*/ ctx[0].pathname === '/employees');
    			add_location(a0, file$b, 19, 1, 546);
    			attr_dev(a1, "href", "/employees/register");
    			attr_dev(a1, "class", "tab-button");
    			toggle_class(a1, "active", /*$location*/ ctx[0].pathname === '/employees/register');
    			add_location(a1, file$b, 25, 1, 677);
    			attr_dev(a2, "href", "/employees/search");
    			attr_dev(a2, "class", "tab-button");
    			toggle_class(a2, "active", /*$location*/ ctx[0].pathname === '/employees/search');
    			add_location(a2, file$b, 31, 1, 823);
    			attr_dev(div1, "class", "tab");
    			add_location(div1, file$b, 18, 0, 525);
    			attr_dev(div2, "class", "content-container");
    			add_location(div2, file$b, 39, 0, 971);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(router, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$location*/ 1) {
    				toggle_class(a0, "active", /*$location*/ ctx[0].pathname === '/employees');
    			}

    			if (dirty & /*$location*/ 1) {
    				toggle_class(a1, "active", /*$location*/ ctx[0].pathname === '/employees/register');
    			}

    			if (dirty & /*$location*/ 1) {
    				toggle_class(a2, "active", /*$location*/ ctx[0].pathname === '/employees/search');
    			}

    			const router_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, slide, {});
    					div0_intro.start();
    				});
    			}

    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div2);
    			destroy_component(router);
    			mounted = false;
    			run_all(dispose);
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
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Employees', slots, []);
    	let location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(0, $location = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Employees> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		slide,
    		Overview,
    		AddEmployee,
    		EditEmployee,
    		Router: Router$1,
    		Route: Route$1,
    		link,
    		useLocation,
    		location,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 1) {
    			sessionStorage.setItem('lastVisited', $location.pathname);
    		}
    	};

    	return [$location, location];
    }

    class Employees extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Employees",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules\svelte-icons\go\GoUnverified.svelte generated by Svelte v3.48.0 */
    const file$a = "node_modules\\svelte-icons\\go\\GoUnverified.svelte";

    // (4:8) <IconBase viewBox="0 0 16 16" {...$$props}>
    function create_default_slot$8(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M15.67 7.066l-1.08-1.34a1.5 1.5 0 0 1-.309-.77l-.19-1.698a1.51 1.51 0 0 0-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 0 0-1.878 0l-1.34 1.08a1.5 1.5 0 0 1-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 0 0 0 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 0 0 0-1.878zM9 11.5c0 .28-.22.5-.5.5h-1c-.27 0-.5-.22-.5-.5v-1c0-.28.23-.5.5-.5h1c.28 0 .5.22.5.5v1zm1.56-4.89c-.06.17-.17.33-.3.47-.13.16-.14.19-.33.38-.16.17-.31.3-.52.45-.11.09-.2.19-.28.27-.08.08-.14.17-.19.27-.05.1-.08.19-.11.3-.03.11-.03.13-.03.25H7.13c0-.22 0-.31.03-.48.03-.19.08-.36.14-.52.06-.14.14-.28.25-.42.11-.13.23-.25.41-.38.27-.19.36-.3.48-.52.12-.22.2-.38.2-.59 0-.27-.06-.45-.2-.58-.13-.13-.31-.19-.58-.19-.09 0-.19.02-.3.05-.11.03-.17.09-.25.16-.08.07-.14.11-.2.2a.41.41 0 0 0-.09.28h-2c0-.38.13-.56.27-.83.16-.27.36-.5.61-.67.25-.17.55-.3.88-.38.33-.08.7-.13 1.09-.13.44 0 .83.05 1.17.13.34.09.63.22.88.39.23.17.41.38.55.63.13.25.19.55.19.88 0 .22 0 .42-.08.59l-.02-.01z");
    			add_location(path, file$a, 4, 10, 151);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 16 16\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 16 16" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GoUnverified', slots, []);

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

    class GoUnverified extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoUnverified",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules\svelte-icons\go\GoVerified.svelte generated by Svelte v3.48.0 */
    const file$9 = "node_modules\\svelte-icons\\go\\GoVerified.svelte";

    // (4:8) <IconBase viewBox="0 0 16 16" {...$$props}>
    function create_default_slot$7(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M15.67 7.066l-1.08-1.34a1.5 1.5 0 0 1-.309-.77l-.19-1.698a1.51 1.51 0 0 0-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 0 0-1.878 0l-1.34 1.08a1.5 1.5 0 0 1-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 0 0 0 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 0 0 0-1.878zM6.5 12.01L3 8.51l1.5-1.5 2 2 5-5L13 5.56l-6.5 6.45z");
    			add_location(path, file$9, 4, 10, 151);
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 16 16\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 16 16" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GoVerified', slots, []);

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

    class GoVerified extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GoVerified",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\Private\MySettings\General.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\Private\\MySettings\\General.svelte";

    // (24:1) {#if isAdmin}
    function create_if_block_2$2(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t6_value = /*employees*/ ctx[1].length + "";
    	let t6;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Administrator";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Ja";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "Medarbejder";
    			t5 = space();
    			p3 = element("p");
    			t6 = text(t6_value);
    			add_location(p0, file$8, 24, 2, 722);
    			attr_dev(p1, "class", "value");
    			add_location(p1, file$8, 25, 2, 746);
    			add_location(p2, file$8, 27, 2, 775);
    			attr_dev(p3, "class", "value");
    			add_location(p3, file$8, 28, 2, 797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*employees*/ 2 && t6_value !== (t6_value = /*employees*/ ctx[1].length + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(24:1) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    // (41:3) {:else}
    function create_else_block$3(ctx) {
    	let gounverified;
    	let current;
    	gounverified = new GoUnverified({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gounverified.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gounverified, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gounverified.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gounverified.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gounverified, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(41:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:3) {#if $user.verified}
    function create_if_block_1$3(ctx) {
    	let goverified;
    	let current;
    	goverified = new GoVerified({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(goverified.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(goverified, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(goverified.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(goverified.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(goverified, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(39:3) {#if $user.verified}",
    		ctx
    	});

    	return block;
    }

    // (46:1) {#if !$user.verified}
    function create_if_block$3(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let button;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Har du ikke modtaget verificerings mail?";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Klik på knappen nedenfor for at tilsendt en ny mail";
    			t3 = space();
    			button = element("button");
    			button.textContent = "Send verificerings mail";
    			attr_dev(p0, "class", "info-text");
    			add_location(p0, file$8, 47, 3, 1160);
    			attr_dev(p1, "class", "info-text");
    			add_location(p1, file$8, 48, 3, 1230);
    			attr_dev(div, "class", "grid-full-column");
    			add_location(div, file$8, 46, 2, 1125);
    			attr_dev(button, "class", "button");
    			add_location(button, file$8, 50, 2, 1320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(46:1) {#if !$user.verified}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t3_value = /*company*/ ctx[0].name + "";
    	let t3;
    	let t4;
    	let p2;
    	let t6;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block1;
    	let t7;
    	let current;
    	let if_block0 = isAdmin && create_if_block_2$2(ctx);
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[2].verified) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = !/*$user*/ ctx[2].verified && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Virksomhed";
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "Verficeret";
    			t6 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if_block1.c();
    			t7 = space();
    			if (if_block2) if_block2.c();
    			add_location(p0, file$8, 31, 1, 849);
    			attr_dev(p1, "class", "value");
    			add_location(p1, file$8, 32, 1, 869);
    			add_location(p2, file$8, 34, 1, 909);
    			attr_dev(div0, "class", "icon-small");
    			add_location(div0, file$8, 37, 2, 965);
    			attr_dev(div1, "class", "center-container");
    			add_location(div1, file$8, 36, 1, 931);
    			attr_dev(div2, "class", "grid-container");
    			add_location(div2, file$8, 22, 0, 674);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, p0);
    			append_dev(div2, t2);
    			append_dev(div2, p1);
    			append_dev(p1, t3);
    			append_dev(div2, t4);
    			append_dev(div2, p2);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div2, t7);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (isAdmin) if_block0.p(ctx, dirty);
    			if ((!current || dirty & /*company*/ 1) && t3_value !== (t3_value = /*company*/ ctx[0].name + "")) set_data_dev(t3, t3_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, null);
    			}

    			if (!/*$user*/ ctx[2].verified) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (if_block2) if_block2.d();
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
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('General', slots, []);
    	let company = {};
    	let employees = [];

    	onMount(async () => {
    		const { payload, error } = await apiGet(GET_COMPANY($user.companyId));

    		if (error) {
    			notifyError$1(error.message);
    		} else {
    			$$invalidate(0, company = payload.company);
    			$$invalidate(1, employees = company.employees);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<General> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		user,
    		isAdmin,
    		apiGet,
    		notifyError: notifyError$1,
    		GET_COMPANY,
    		GoUnverified,
    		GoVerified,
    		company,
    		employees,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('company' in $$props) $$invalidate(0, company = $$props.company);
    		if ('employees' in $$props) $$invalidate(1, employees = $$props.employees);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [company, employees, $user];
    }

    class General extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "General",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules\svelte-icons\fa\FaChevronDown.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules\\svelte-icons\\fa\\FaChevronDown.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$6(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z");
    			add_location(path, file$7, 4, 10, 153);
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
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaChevronDown', slots, []);

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

    class FaChevronDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaChevronDown",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules\svelte-icons\fa\FaChevronUp.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules\\svelte-icons\\fa\\FaChevronUp.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$5(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z");
    			add_location(path, file$6, 4, 10, 153);
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
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaChevronUp', slots, []);

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

    class FaChevronUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaChevronUp",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules\svelte-icons\io\IoIosTrash.svelte generated by Svelte v3.48.0 */
    const file$5 = "node_modules\\svelte-icons\\io\\IoIosTrash.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M133.1 128l23.6 290.7c0 16.2 13.1 29.3 29.3 29.3h141c16.2 0 29.3-13.1 29.3-29.3L379.6 128H133.1zm61.6 265L188 160h18.5l6.9 233h-18.7zm70.3 0h-18V160h18v233zm52.3 0h-18.6l6.8-233H324l-6.7 233zM364 92h-36l-26.3-23c-3.7-3.2-8.4-5-13.2-5h-64.8c-4.9 0-9.7 1.8-13.4 5L184 92h-36c-17.6 0-30 8.4-30 26h276c0-17.6-12.4-26-30-26z");
    			add_location(path, file$5, 4, 10, 153);
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

    function create_fragment$6(ctx) {
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosTrash', slots, []);

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

    class IoIosTrash extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosTrash",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Private\MySettings\MyAccount.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\Private\\MySettings\\MyAccount.svelte";

    // (114:39) {:else}
    function create_else_block_3(ctx) {
    	let fachevrondown;
    	let current;
    	fachevrondown = new FaChevronDown({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fachevrondown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fachevrondown, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fachevrondown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fachevrondown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fachevrondown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(114:39) {:else}",
    		ctx
    	});

    	return block;
    }

    // (114:6) {#if showAddress}
    function create_if_block_8(ctx) {
    	let fachevronup;
    	let current;
    	fachevronup = new FaChevronUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fachevronup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fachevronup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fachevronup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fachevronup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fachevronup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(114:6) {#if showAddress}",
    		ctx
    	});

    	return block;
    }

    // (119:3) {#if showAddress}
    function create_if_block_7(ctx) {
    	let div;
    	let t0;
    	let p0;
    	let t2;
    	let input0;
    	let input0_readonly_value;
    	let t3;
    	let p1;
    	let t5;
    	let input1;
    	let input1_readonly_value;
    	let t6;
    	let p2;
    	let t8;
    	let input2;
    	let input2_readonly_value;
    	let t9;
    	let p3;
    	let t11;
    	let input3;
    	let input3_readonly_value;
    	let t12;
    	let p4;
    	let t14;
    	let input4;
    	let input4_readonly_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Land";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "By";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Vej";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "Vej nummer";
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "Post nummer";
    			t14 = space();
    			input4 = element("input");
    			attr_dev(div, "class", "grid-full-column divider");
    			add_location(div, file$4, 119, 4, 3070);
    			add_location(p0, file$4, 120, 4, 3116);
    			input0.readOnly = input0_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input0, "value", !/*editable*/ ctx[0]);
    			toggle_class(input0, "editable-value", /*editable*/ ctx[0]);
    			add_location(input0, file$4, 121, 4, 3133);
    			add_location(p1, file$4, 127, 4, 3289);
    			input1.readOnly = input1_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input1, "value", !/*editable*/ ctx[0]);
    			toggle_class(input1, "editable-value", /*editable*/ ctx[0]);
    			add_location(input1, file$4, 128, 4, 3304);
    			add_location(p2, file$4, 134, 4, 3457);
    			input2.readOnly = input2_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input2, "value", !/*editable*/ ctx[0]);
    			toggle_class(input2, "editable-value", /*editable*/ ctx[0]);
    			add_location(input2, file$4, 135, 4, 3473);
    			add_location(p3, file$4, 141, 4, 3628);
    			input3.readOnly = input3_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input3, "value", !/*editable*/ ctx[0]);
    			toggle_class(input3, "editable-value", /*editable*/ ctx[0]);
    			add_location(input3, file$4, 142, 4, 3651);
    			add_location(p4, file$4, 148, 4, 3812);
    			input4.readOnly = input4_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input4, "value", !/*editable*/ ctx[0]);
    			toggle_class(input4, "editable-value", /*editable*/ ctx[0]);
    			add_location(input4, file$4, 149, 4, 3836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*$user*/ ctx[8].address.country);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*$user*/ ctx[8].address.city);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*$user*/ ctx[8].address.street);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, input3, anchor);
    			set_input_value(input3, /*$user*/ ctx[8].address.streetnumber);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, input4, anchor);
    			set_input_value(input4, /*$user*/ ctx[8].address.zip);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*editable*/ 1 && input0_readonly_value !== (input0_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input0, "readOnly", input0_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input0.value !== /*$user*/ ctx[8].address.country) {
    				set_input_value(input0, /*$user*/ ctx[8].address.country);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input0, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input0, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1 && input1_readonly_value !== (input1_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input1, "readOnly", input1_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input1.value !== /*$user*/ ctx[8].address.city) {
    				set_input_value(input1, /*$user*/ ctx[8].address.city);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input1, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input1, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1 && input2_readonly_value !== (input2_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input2, "readOnly", input2_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input2.value !== /*$user*/ ctx[8].address.street) {
    				set_input_value(input2, /*$user*/ ctx[8].address.street);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input2, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input2, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1 && input3_readonly_value !== (input3_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input3, "readOnly", input3_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input3.value !== /*$user*/ ctx[8].address.streetnumber) {
    				set_input_value(input3, /*$user*/ ctx[8].address.streetnumber);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input3, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input3, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1 && input4_readonly_value !== (input4_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input4, "readOnly", input4_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input4.value !== /*$user*/ ctx[8].address.zip) {
    				set_input_value(input4, /*$user*/ ctx[8].address.zip);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input4, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input4, "editable-value", /*editable*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(input3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(input4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(119:3) {#if showAddress}",
    		ctx
    	});

    	return block;
    }

    // (160:43) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gem person oplysninger");
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
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(160:43) {:else}",
    		ctx
    	});

    	return block;
    }

    // (160:4) {#if !editable}
    function create_if_block_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ændre person oplysninger");
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(160:4) {#if !editable}",
    		ctx
    	});

    	return block;
    }

    // (170:37) {:else}
    function create_else_block_1$2(ctx) {
    	let fachevrondown;
    	let current;
    	fachevrondown = new FaChevronDown({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fachevrondown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fachevrondown, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fachevrondown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fachevrondown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fachevrondown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(170:37) {:else}",
    		ctx
    	});

    	return block;
    }

    // (170:6) {#if showLogin}
    function create_if_block_5(ctx) {
    	let fachevronup;
    	let current;
    	fachevronup = new FaChevronUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fachevronup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fachevronup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fachevronup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fachevronup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fachevronup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(170:6) {#if showLogin}",
    		ctx
    	});

    	return block;
    }

    // (174:3) {#if showLogin}
    function create_if_block_3(ctx) {
    	let div;
    	let t0;
    	let p;
    	let t2;
    	let input;
    	let input_readonly_value;
    	let t3;
    	let if_block_anchor;
    	let if_block = /*logonEdit*/ ctx[1] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			p = element("p");
    			p.textContent = "E-mail";
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    			attr_dev(div, "class", "grid-full-column divider");
    			add_location(div, file$4, 174, 4, 4565);
    			add_location(p, file$4, 175, 4, 4611);
    			attr_dev(input, "class", "editable-value");
    			input.value = /*email*/ ctx[4];
    			input.readOnly = input_readonly_value = !/*logonEdit*/ ctx[1];
    			add_location(input, file$4, 176, 4, 4630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*email*/ 16 && input.value !== /*email*/ ctx[4]) {
    				prop_dev(input, "value", /*email*/ ctx[4]);
    			}

    			if (dirty & /*logonEdit*/ 2 && input_readonly_value !== (input_readonly_value = !/*logonEdit*/ ctx[1])) {
    				prop_dev(input, "readOnly", input_readonly_value);
    			}

    			if (/*logonEdit*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(174:3) {#if showLogin}",
    		ctx
    	});

    	return block;
    }

    // (178:4) {#if logonEdit}
    function create_if_block_4(ctx) {
    	let p0;
    	let t1;
    	let input0;
    	let t2;
    	let p1;
    	let t4;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Ny Adgangskode";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Bekræft Ny Adgangskode";
    			t4 = space();
    			input1 = element("input");
    			add_location(p0, file$4, 178, 5, 4726);
    			attr_dev(input0, "class", "editable-value");
    			add_location(input0, file$4, 179, 5, 4754);
    			add_location(p1, file$4, 181, 5, 4817);
    			attr_dev(input1, "class", "editable-value");
    			add_location(input1, file$4, 182, 5, 4853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*password*/ ctx[5]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*rePass*/ ctx[6]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_2*/ ctx[24]),
    					listen_dev(input1, "input", /*input1_input_handler_2*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*password*/ 32 && input0.value !== /*password*/ ctx[5]) {
    				set_input_value(input0, /*password*/ ctx[5]);
    			}

    			if (dirty & /*rePass*/ 64 && input1.value !== /*rePass*/ ctx[6]) {
    				set_input_value(input1, /*rePass*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(178:4) {#if logonEdit}",
    		ctx
    	});

    	return block;
    }

    // (187:2) {#if showLogin}
    function create_if_block_1$2(ctx) {
    	let br;
    	let t;
    	let button;
    	let mounted;
    	let dispose;

    	function select_block_type_3(ctx, dirty) {
    		if (!/*logonEdit*/ ctx[1]) return create_if_block_2$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			br = element("br");
    			t = space();
    			button = element("button");
    			if_block.c();
    			add_location(br, file$4, 187, 3, 4960);
    			attr_dev(button, "class", "button");
    			add_location(button, file$4, 188, 3, 4971);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, button, anchor);
    			if_block.m(button, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*saveAuthenticationChange*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(187:2) {#if showLogin}",
    		ctx
    	});

    	return block;
    }

    // (190:44) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gem login oplysninger");
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(190:44) {:else}",
    		ctx
    	});

    	return block;
    }

    // (190:5) {#if !logonEdit}
    function create_if_block_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ændre login oplysninger");
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(190:5) {#if !logonEdit}",
    		ctx
    	});

    	return block;
    }

    // (196:1) {#if $isAdmin}
    function create_if_block$2(ctx) {
    	let div4;
    	let div3;
    	let p0;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let ioiostrash;
    	let t2;
    	let div9;
    	let div8;
    	let div5;
    	let h3;
    	let t4;
    	let div6;
    	let p1;
    	let t6;
    	let br;
    	let t7;
    	let b;
    	let t9;
    	let div7;
    	let button0;
    	let t11;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	ioiostrash = new IoIosTrash({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			p0 = element("p");
    			p0.textContent = "Slet konto";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(ioiostrash.$$.fragment);
    			t2 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Bekræft sletning";
    			t4 = space();
    			div6 = element("div");
    			p1 = element("p");
    			p1.textContent = "Du er ved at slette din virksomhed og alle associeret medarbejder, opslag,\r\n\t\t\t\t\t\tvagter";
    			t6 = space();
    			br = element("br");
    			t7 = space();
    			b = element("b");
    			b.textContent = "Er du sikker på du vil fortsætte?";
    			t9 = space();
    			div7 = element("div");
    			button0 = element("button");
    			button0.textContent = "Nej";
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Ja";
    			attr_dev(p0, "class", "undertitle w3-text-red");
    			add_location(p0, file$4, 198, 4, 5254);
    			attr_dev(div0, "class", "icon-small trash svelte-dpaakp");
    			add_location(div0, file$4, 204, 6, 5448);
    			attr_dev(div1, "class", "center-container");
    			add_location(div1, file$4, 203, 5, 5410);
    			attr_dev(div2, "class", "grid-full-column delete svelte-dpaakp");
    			add_location(div2, file$4, 199, 4, 5308);
    			attr_dev(div3, "class", "grid-container");
    			add_location(div3, file$4, 197, 3, 5220);
    			attr_dev(div4, "class", "flex-container delete-account svelte-dpaakp");
    			add_location(div4, file$4, 196, 2, 5172);
    			add_location(h3, file$4, 212, 5, 5706);
    			attr_dev(div5, "class", "modal-header");
    			add_location(div5, file$4, 211, 4, 5673);
    			add_location(p1, file$4, 215, 5, 5780);
    			add_location(br, file$4, 219, 5, 5897);
    			add_location(b, file$4, 220, 5, 5910);
    			attr_dev(div6, "class", "modal-body");
    			add_location(div6, file$4, 214, 4, 5749);
    			attr_dev(button0, "class", "modal-button");
    			add_location(button0, file$4, 223, 5, 6001);
    			attr_dev(button1, "class", "modal-button");
    			set_style(button1, "color", `#fff`, false);
    			set_style(button1, "background-color", `red`, false);
    			add_location(button1, file$4, 226, 5, 6105);
    			attr_dev(div7, "class", "modal-footer");
    			add_location(div7, file$4, 222, 4, 5968);
    			attr_dev(div8, "class", "w3-modal-content w3-animate-zoom modal-container");
    			add_location(div8, file$4, 210, 3, 5605);
    			attr_dev(div9, "class", "w3-modal");
    			toggle_class(div9, "w3-show", /*deleteConfirm*/ ctx[7]);
    			add_location(div9, file$4, 209, 2, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, p0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(ioiostrash, div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, h3);
    			append_dev(div8, t4);
    			append_dev(div8, div6);
    			append_dev(div6, p1);
    			append_dev(div6, t6);
    			append_dev(div6, br);
    			append_dev(div6, t7);
    			append_dev(div6, b);
    			append_dev(div8, t9);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			append_dev(div7, t11);
    			append_dev(div7, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[26], false, false, false),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[27], false, false, false),
    					listen_dev(button1, "click", /*deleteAccount*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*deleteConfirm*/ 128) {
    				toggle_class(div9, "w3-show", /*deleteConfirm*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiostrash.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiostrash.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(ioiostrash);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(196:1) {#if $isAdmin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div13;
    	let div7;
    	let div2;
    	let div1;
    	let p0;
    	let t1;
    	let div0;
    	let t2;
    	let p1;
    	let t4;
    	let input0;
    	let input0_readonly_value;
    	let t5;
    	let p2;
    	let t7;
    	let input1;
    	let input1_readonly_value;
    	let t8;
    	let p3;
    	let t10;
    	let input2;
    	let input2_readonly_value;
    	let t11;
    	let p4;
    	let t13;
    	let input3;
    	let input3_readonly_value;
    	let t14;
    	let div6;
    	let div5;
    	let div4;
    	let p5;
    	let t16;
    	let div3;
    	let current_block_type_index;
    	let if_block0;
    	let t17;
    	let t18;
    	let br0;
    	let t19;
    	let button;
    	let t20;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let p6;
    	let t22;
    	let div8;
    	let current_block_type_index_1;
    	let if_block3;
    	let t23;
    	let t24;
    	let t25;
    	let br1;
    	let t26;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_8, create_else_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showAddress*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*showAddress*/ ctx[2] && create_if_block_7(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (!/*editable*/ ctx[0]) return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block2 = current_block_type(ctx);
    	const if_block_creators_1 = [create_if_block_5, create_else_block_1$2];
    	const if_blocks_1 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*showLogin*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_2(ctx);
    	if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let if_block4 = /*showLogin*/ ctx[3] && create_if_block_3(ctx);
    	let if_block5 = /*showLogin*/ ctx[3] && create_if_block_1$2(ctx);
    	let if_block6 = /*$isAdmin*/ ctx[9] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div7 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Personlig detaljer";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Fornavn";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Efternavn";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "Telefon";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			p4 = element("p");
    			p4.textContent = "Profil Billede";
    			t13 = space();
    			input3 = element("input");
    			t14 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			p5 = element("p");
    			p5.textContent = "Adresse";
    			t16 = space();
    			div3 = element("div");
    			if_block0.c();
    			t17 = space();
    			if (if_block1) if_block1.c();
    			t18 = space();
    			br0 = element("br");
    			t19 = space();
    			button = element("button");
    			if_block2.c();
    			t20 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			p6 = element("p");
    			p6.textContent = "Login detaljer";
    			t22 = space();
    			div8 = element("div");
    			if_block3.c();
    			t23 = space();
    			if (if_block4) if_block4.c();
    			t24 = space();
    			if (if_block5) if_block5.c();
    			t25 = space();
    			br1 = element("br");
    			t26 = space();
    			if (if_block6) if_block6.c();
    			attr_dev(p0, "class", "undertitle");
    			add_location(p0, file$4, 76, 4, 1952);
    			attr_dev(div0, "class", "divider");
    			add_location(div0, file$4, 77, 4, 2002);
    			attr_dev(div1, "class", "grid-full-column");
    			add_location(div1, file$4, 75, 3, 1915);
    			add_location(p1, file$4, 79, 3, 2041);
    			input0.readOnly = input0_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input0, "value", !/*editable*/ ctx[0]);
    			toggle_class(input0, "editable-value", /*editable*/ ctx[0]);
    			add_location(input0, file$4, 80, 3, 2060);
    			add_location(p2, file$4, 86, 3, 2204);
    			input1.readOnly = input1_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input1, "value", !/*editable*/ ctx[0]);
    			toggle_class(input1, "editable-value", /*editable*/ ctx[0]);
    			add_location(input1, file$4, 87, 3, 2225);
    			add_location(p3, file$4, 93, 3, 2368);
    			input2.readOnly = input2_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input2, "value", !/*editable*/ ctx[0]);
    			toggle_class(input2, "editable-value", /*editable*/ ctx[0]);
    			add_location(input2, file$4, 94, 3, 2387);
    			add_location(p4, file$4, 100, 3, 2527);
    			input3.readOnly = input3_readonly_value = !/*editable*/ ctx[0];
    			toggle_class(input3, "value", !/*editable*/ ctx[0]);
    			toggle_class(input3, "editable-value", /*editable*/ ctx[0]);
    			add_location(input3, file$4, 101, 3, 2553);
    			attr_dev(div2, "class", "grid-container");
    			add_location(div2, file$4, 74, 2, 1882);
    			attr_dev(p5, "class", "undertitle");
    			add_location(p5, file$4, 111, 5, 2819);
    			attr_dev(div3, "class", "icon-tiny icon");
    			add_location(div3, file$4, 112, 5, 2859);
    			attr_dev(div4, "class", "flex-align");
    			set_style(div4, "width", `50%`, false);
    			add_location(div4, file$4, 110, 4, 2770);
    			attr_dev(div5, "class", "grid-full-column");
    			add_location(div5, file$4, 109, 3, 2733);
    			attr_dev(div6, "class", "grid-container ");
    			add_location(div6, file$4, 108, 2, 2699);
    			add_location(br0, file$4, 157, 2, 4006);
    			attr_dev(button, "class", "button");
    			add_location(button, file$4, 158, 2, 4016);
    			attr_dev(div7, "class", "flex-container info-container");
    			add_location(div7, file$4, 73, 1, 1835);
    			attr_dev(p6, "class", "undertitle");
    			add_location(p6, file$4, 167, 5, 4336);
    			attr_dev(div8, "class", "icon-tiny icon");
    			add_location(div8, file$4, 168, 5, 4383);
    			attr_dev(div9, "class", "flex-align");
    			set_style(div9, "width", `50%`, false);
    			add_location(div9, file$4, 166, 4, 4287);
    			attr_dev(div10, "class", "grid-full-column");
    			add_location(div10, file$4, 165, 3, 4250);
    			attr_dev(div11, "class", "grid-container");
    			add_location(div11, file$4, 164, 2, 4217);
    			attr_dev(div12, "class", "flex-container info-container");
    			add_location(div12, file$4, 163, 1, 4170);
    			add_location(br1, file$4, 194, 1, 5145);
    			attr_dev(div13, "class", "flex-container");
    			add_location(div13, file$4, 72, 0, 1804);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div7);
    			append_dev(div7, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div2, t2);
    			append_dev(div2, p1);
    			append_dev(div2, t4);
    			append_dev(div2, input0);
    			set_input_value(input0, /*$user*/ ctx[8].firstname);
    			append_dev(div2, t5);
    			append_dev(div2, p2);
    			append_dev(div2, t7);
    			append_dev(div2, input1);
    			set_input_value(input1, /*$user*/ ctx[8].lastname);
    			append_dev(div2, t8);
    			append_dev(div2, p3);
    			append_dev(div2, t10);
    			append_dev(div2, input2);
    			set_input_value(input2, /*$user*/ ctx[8].phone);
    			append_dev(div2, t11);
    			append_dev(div2, p4);
    			append_dev(div2, t13);
    			append_dev(div2, input3);
    			set_input_value(input3, /*$user*/ ctx[8].pb);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p5);
    			append_dev(div4, t16);
    			append_dev(div4, div3);
    			if_blocks[current_block_type_index].m(div3, null);
    			append_dev(div6, t17);
    			if (if_block1) if_block1.m(div6, null);
    			append_dev(div7, t18);
    			append_dev(div7, br0);
    			append_dev(div7, t19);
    			append_dev(div7, button);
    			if_block2.m(button, null);
    			append_dev(div13, t20);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, p6);
    			append_dev(div9, t22);
    			append_dev(div9, div8);
    			if_blocks_1[current_block_type_index_1].m(div8, null);
    			append_dev(div11, t23);
    			if (if_block4) if_block4.m(div11, null);
    			append_dev(div12, t24);
    			if (if_block5) if_block5.m(div12, null);
    			append_dev(div13, t25);
    			append_dev(div13, br1);
    			append_dev(div13, t26);
    			if (if_block6) if_block6.m(div13, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[17]),
    					listen_dev(div3, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(button, "click", /*saveUserChange*/ ctx[11], false, false, false),
    					listen_dev(div8, "click", /*toggleLogin*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*editable*/ 1 && input0_readonly_value !== (input0_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input0, "readOnly", input0_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input0.value !== /*$user*/ ctx[8].firstname) {
    				set_input_value(input0, /*$user*/ ctx[8].firstname);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input0, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input0, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (!current || dirty & /*editable*/ 1 && input1_readonly_value !== (input1_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input1, "readOnly", input1_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input1.value !== /*$user*/ ctx[8].lastname) {
    				set_input_value(input1, /*$user*/ ctx[8].lastname);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input1, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input1, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (!current || dirty & /*editable*/ 1 && input2_readonly_value !== (input2_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input2, "readOnly", input2_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input2.value !== /*$user*/ ctx[8].phone) {
    				set_input_value(input2, /*$user*/ ctx[8].phone);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input2, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input2, "editable-value", /*editable*/ ctx[0]);
    			}

    			if (!current || dirty & /*editable*/ 1 && input3_readonly_value !== (input3_readonly_value = !/*editable*/ ctx[0])) {
    				prop_dev(input3, "readOnly", input3_readonly_value);
    			}

    			if (dirty & /*$user*/ 256 && input3.value !== /*$user*/ ctx[8].pb) {
    				set_input_value(input3, /*$user*/ ctx[8].pb);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input3, "value", !/*editable*/ ctx[0]);
    			}

    			if (dirty & /*editable*/ 1) {
    				toggle_class(input3, "editable-value", /*editable*/ ctx[0]);
    			}

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
    				if_block0.m(div3, null);
    			}

    			if (/*showAddress*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(div6, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(button, null);
    				}
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_2(ctx);

    			if (current_block_type_index_1 !== previous_block_index_1) {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks_1[current_block_type_index_1];

    				if (!if_block3) {
    					if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block3.c();
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div8, null);
    			}

    			if (/*showLogin*/ ctx[3]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_3(ctx);
    					if_block4.c();
    					if_block4.m(div11, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*showLogin*/ ctx[3]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$2(ctx);
    					if_block5.c();
    					if_block5.m(div12, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*$isAdmin*/ ctx[9]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*$isAdmin*/ 512) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block$2(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div13, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block3);
    			transition_in(if_block6);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block3);
    			transition_out(if_block6);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			if_blocks_1[current_block_type_index_1].d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $user;
    	let $page;
    	let $isAdmin;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(8, $user = $$value));
    	validate_store(page, 'page');
    	component_subscribe($$self, page, $$value => $$invalidate(28, $page = $$value));
    	validate_store(isAdmin, 'isAdmin');
    	component_subscribe($$self, isAdmin, $$value => $$invalidate(9, $isAdmin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyAccount', slots, []);
    	let editable = false;
    	let logonEdit = false;
    	let showAddress = false;
    	let showLogin = false;
    	let email = '';
    	let password = '';
    	let rePass = '';
    	let deleteConfirm = false;

    	onMount(async () => {
    		await getLogin();
    	});

    	async function deleteAccount() {
    		const { error, payload } = await apiDelete(DELETE_COMPANY());

    		if (payload) {
    			set_store_value(user, $user = {}, $user);
    			set_store_value(page, $page = '/', $page);
    		} else notifyError$1(error.message);
    	}

    	async function saveUserChange() {
    		if (editable) {
    			const { payload } = await apiPatch(PATCH_USER(), $user);

    			if (payload) {
    				notifySuccess(payload.message);
    			}

    			$$invalidate(0, editable = false);
    		} else $$invalidate(0, editable = true);
    	}

    	async function saveAuthenticationChange() {
    		if (logonEdit) {

    			notifyError$1('Adganskode matcher ikke');
    		} else $$invalidate(1, logonEdit = true);
    	}

    	async function getLogin() {
    		const { payload, error } = await apiGet(GET_LOGIN());

    		if (payload) {
    			$$invalidate(4, email = payload.login.email);
    		}
    	}

    	function toggleLogin() {
    		if (showLogin) {
    			$$invalidate(3, showLogin = false);
    			$$invalidate(1, logonEdit = false);
    			$$invalidate(5, password = '');
    			$$invalidate(6, rePass = '');
    		} else {
    			$$invalidate(3, showLogin = true);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyAccount> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$user.firstname = this.value;
    		user.set($user);
    	}

    	function input1_input_handler() {
    		$user.lastname = this.value;
    		user.set($user);
    	}

    	function input2_input_handler() {
    		$user.phone = this.value;
    		user.set($user);
    	}

    	function input3_input_handler() {
    		$user.pb = this.value;
    		user.set($user);
    	}

    	const click_handler = () => $$invalidate(2, showAddress = !showAddress);

    	function input0_input_handler_1() {
    		$user.address.country = this.value;
    		user.set($user);
    	}

    	function input1_input_handler_1() {
    		$user.address.city = this.value;
    		user.set($user);
    	}

    	function input2_input_handler_1() {
    		$user.address.street = this.value;
    		user.set($user);
    	}

    	function input3_input_handler_1() {
    		$user.address.streetnumber = this.value;
    		user.set($user);
    	}

    	function input4_input_handler() {
    		$user.address.zip = this.value;
    		user.set($user);
    	}

    	function input0_input_handler_2() {
    		password = this.value;
    		$$invalidate(5, password);
    	}

    	function input1_input_handler_2() {
    		rePass = this.value;
    		$$invalidate(6, rePass);
    	}

    	const click_handler_1 = () => $$invalidate(7, deleteConfirm = true);
    	const click_handler_2 = () => $$invalidate(7, deleteConfirm = false);

    	$$self.$capture_state = () => ({
    		FaChevronDown,
    		FaChevronUp,
    		IoIosTrash,
    		PATCH_USER,
    		GET_LOGIN,
    		DELETE_COMPANY,
    		onMount,
    		user,
    		isAdmin,
    		apiPatch,
    		apiGet,
    		apiDelete,
    		notifySuccess,
    		notifyInfo,
    		notifyError: notifyError$1,
    		navigate,
    		page,
    		editable,
    		logonEdit,
    		showAddress,
    		showLogin,
    		email,
    		password,
    		rePass,
    		deleteConfirm,
    		deleteAccount,
    		saveUserChange,
    		saveAuthenticationChange,
    		getLogin,
    		toggleLogin,
    		$user,
    		$page,
    		$isAdmin
    	});

    	$$self.$inject_state = $$props => {
    		if ('editable' in $$props) $$invalidate(0, editable = $$props.editable);
    		if ('logonEdit' in $$props) $$invalidate(1, logonEdit = $$props.logonEdit);
    		if ('showAddress' in $$props) $$invalidate(2, showAddress = $$props.showAddress);
    		if ('showLogin' in $$props) $$invalidate(3, showLogin = $$props.showLogin);
    		if ('email' in $$props) $$invalidate(4, email = $$props.email);
    		if ('password' in $$props) $$invalidate(5, password = $$props.password);
    		if ('rePass' in $$props) $$invalidate(6, rePass = $$props.rePass);
    		if ('deleteConfirm' in $$props) $$invalidate(7, deleteConfirm = $$props.deleteConfirm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		editable,
    		logonEdit,
    		showAddress,
    		showLogin,
    		email,
    		password,
    		rePass,
    		deleteConfirm,
    		$user,
    		$isAdmin,
    		deleteAccount,
    		saveUserChange,
    		saveAuthenticationChange,
    		toggleLogin,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler,
    		input0_input_handler_2,
    		input1_input_handler_2,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class MyAccount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyAccount",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\Private\MySettings\App.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\Private\\MySettings\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (54:4) {#if theme.name !== 'custom'}
    function create_if_block_2(ctx) {
    	let option;
    	let t_value = /*theme*/ ctx[11]['display-name'] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*theme*/ ctx[11].name;
    			option.value = option.__value;
    			add_location(option, file$3, 54, 5, 1243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$themes*/ 8 && t_value !== (t_value = /*theme*/ ctx[11]['display-name'] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$themes*/ 8 && option_value_value !== (option_value_value = /*theme*/ ctx[11].name)) {
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(54:4) {#if theme.name !== 'custom'}",
    		ctx
    	});

    	return block;
    }

    // (53:3) {#each $themes as theme}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*theme*/ ctx[11].name !== 'custom' && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*theme*/ ctx[11].name !== 'custom') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(53:3) {#each $themes as theme}",
    		ctx
    	});

    	return block;
    }

    // (74:2) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let h3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Tema funktionen er låst indtil du verificeres";
    			add_location(h3, file$3, 75, 4, 1885);
    			attr_dev(div, "class", "center-container");
    			add_location(div, file$3, 74, 3, 1849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(74:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:2) {#if $user.verified}
    function create_if_block_1$1(ctx) {
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Hvis du ikke gemmer, bliver temaet nulstillet næste gang siden opdateres .";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Vær opmærksom på hvis du gemmer dit Tema valg, gemmes den for altid på din\r\n\t\t\t\tnuværende browser, indtil du tømmer din browser data.";
    			attr_dev(p0, "class", "grid-full-column info-text");
    			add_location(p0, file$3, 66, 3, 1515);
    			attr_dev(p1, "class", "grid-full-column info-text");
    			add_location(p1, file$3, 69, 3, 1647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(66:2) {#if $user.verified}",
    		ctx
    	});

    	return block;
    }

    // (84:43) {:else}
    function create_else_block$1(ctx) {
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(84:43) {:else}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if !playing}
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:4) {#if !playing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let div0;
    	let b;
    	let t1;
    	let p0;
    	let t3;
    	let select;
    	let t4;
    	let p1;
    	let t6;
    	let button0;
    	let t8;
    	let t9;
    	let div1;
    	let t10;
    	let div2;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value = /*$themes*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[2].verified) return create_if_block_1$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (!/*playing*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			b = element("b");
    			b.textContent = "Vælg en tema fra vores eget udvalg";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Tema";
    			t3 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Gem Tema";
    			t6 = space();
    			button0 = element("button");
    			button0.textContent = "Gem";
    			t8 = space();
    			if_block0.c();
    			t9 = space();
    			div1 = element("div");
    			t10 = space();
    			div2 = element("div");
    			button1 = element("button");
    			if_block1.c();
    			attr_dev(b, "class", "grid-full-column");
    			add_location(b, file$3, 45, 2, 977);
    			add_location(p0, file$3, 46, 2, 1047);
    			if (/*$theme*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			toggle_class(select, "button", /*$user*/ ctx[2].verified);
    			toggle_class(select, "w3-disabled", !/*$user*/ ctx[2].verified);
    			add_location(select, file$3, 47, 2, 1062);
    			add_location(p1, file$3, 58, 2, 1342);
    			toggle_class(button0, "button", /*$user*/ ctx[2].verified);
    			toggle_class(button0, "w3-disabled", !/*$user*/ ctx[2].verified);
    			add_location(button0, file$3, 59, 2, 1361);
    			attr_dev(div0, "class", "grid-container pick-container");
    			add_location(div0, file$3, 44, 1, 930);
    			add_location(div1, file$3, 80, 1, 1973);
    			attr_dev(button1, "class", "button play-button");
    			add_location(button1, file$3, 82, 2, 2030);
    			attr_dev(div2, "class", "grid-container play-container svelte-12c6czq");
    			add_location(div2, file$3, 81, 1, 1983);
    			attr_dev(div3, "class", "flex-container");
    			add_location(div3, file$3, 43, 0, 899);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, b);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$theme*/ ctx[1]);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(div0, t6);
    			append_dev(div0, button0);
    			append_dev(div0, t8);
    			if_block0.m(div0, null);
    			append_dev(div3, t9);
    			append_dev(div3, div1);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			if_block1.m(button1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[6]),
    					listen_dev(button0, "click", /*saveTheme*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*playThemes*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$themes*/ 8) {
    				each_value = /*$themes*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$theme, $themes*/ 10) {
    				select_option(select, /*$theme*/ ctx[1]);
    			}

    			if (dirty & /*$user*/ 4) {
    				toggle_class(select, "button", /*$user*/ ctx[2].verified);
    			}

    			if (dirty & /*$user*/ 4) {
    				toggle_class(select, "w3-disabled", !/*$user*/ ctx[2].verified);
    			}

    			if (dirty & /*$user*/ 4) {
    				toggle_class(button0, "button", /*$user*/ ctx[2].verified);
    			}

    			if (dirty & /*$user*/ 4) {
    				toggle_class(button0, "w3-disabled", !/*$user*/ ctx[2].verified);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(button1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $theme;
    	let $user;
    	let $themes;
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(1, $theme = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
    	validate_store(themes, 'themes');
    	component_subscribe($$self, themes, $$value => $$invalidate(3, $themes = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let playing = false;
    	let count = 0;
    	let playInterval;
    	let playingTheme = false;

    	function resetPlay() {
    		clearInterval(playInterval);
    		count = 0;
    		playingTheme = false;
    		$$invalidate(0, playing = false);
    		set_store_value(theme, $theme = localStorage.getItem('theme'), $theme);
    	}

    	function playThemes() {
    		if (playing) {
    			resetPlay();
    		} else {
    			$$invalidate(0, playing = true);

    			playInterval = setInterval(
    				() => {
    					if (count < $themes.length - 1) {
    						playingTheme = $themes[count];
    						set_store_value(theme, $theme = playingTheme.name, $theme);
    						count++;
    					} else {
    						resetPlay();
    					}
    				},
    				1500
    			);
    		}
    	}

    	function saveTheme() {
    		localStorage.setItem('savedTheme', $theme);
    		localStorage.setItem($user._id, $theme);
    		notifyInfo('Tema gemt');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		$theme = select_value(this);
    		theme.set($theme);
    	}

    	$$self.$capture_state = () => ({
    		themes,
    		theme,
    		notifyInfo,
    		user,
    		playing,
    		count,
    		playInterval,
    		playingTheme,
    		resetPlay,
    		playThemes,
    		saveTheme,
    		$theme,
    		$user,
    		$themes
    	});

    	$$self.$inject_state = $$props => {
    		if ('playing' in $$props) $$invalidate(0, playing = $$props.playing);
    		if ('count' in $$props) count = $$props.count;
    		if ('playInterval' in $$props) playInterval = $$props.playInterval;
    		if ('playingTheme' in $$props) playingTheme = $$props.playingTheme;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [playing, $theme, $user, $themes, playThemes, saveTheme, select_change_handler];
    }

    class App$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Private\MySettings.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\Private\\MySettings.svelte";

    // (41:2) <Route path="/">
    function create_default_slot_3(ctx) {
    	let div;
    	let general;
    	let div_intro;
    	let current;
    	general = new General({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(general.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$2, 41, 3, 1009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(general, div, null);
    			current = true;
    		},
    		p: noop,
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(41:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:3) <Route path="/myaccount">
    function create_default_slot_2(ctx) {
    	let myaccount;
    	let current;
    	myaccount = new MyAccount({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(myaccount.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(myaccount, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(myaccount.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(myaccount.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(myaccount, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(45:3) <Route path=\\\"/myaccount\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:2) <Route path="/app">
    function create_default_slot_1$1(ctx) {
    	let div;
    	let app;
    	let div_intro;
    	let current;
    	app = new App$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(app.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$2, 49, 3, 1202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(app, div, null);
    			current = true;
    		},
    		p: noop,
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(49:2) <Route path=\\\"/app\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:1) <Router primary={false}>
    function create_default_slot$3(ctx) {
    	let route0;
    	let t0;
    	let div;
    	let route1;
    	let div_intro;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/myaccount",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/app",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(div, "class", "content");
    			add_location(div, file$2, 43, 2, 1072);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route1, div, null);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, slide, {});
    					div_intro.start();
    				});
    			}

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
    			if (detaching) detach_dev(div);
    			destroy_component(route1);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(40:1) <Router primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let h1;
    	let div0_intro;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let div2;
    	let router;
    	let current;
    	let mounted;
    	let dispose;

    	router = new Router$1({
    			props: {
    				primary: false,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Mine indstillinger";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "General";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Min Konto";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "App";
    			t7 = space();
    			div2 = element("div");
    			create_component(router.$$.fragment);
    			add_location(h1, file$2, 14, 1, 438);
    			attr_dev(div0, "class", "header w3-card-4");
    			add_location(div0, file$2, 13, 0, 396);
    			attr_dev(a0, "href", "/mysettings/");
    			attr_dev(a0, "class", "tab-button");
    			toggle_class(a0, "active", /*$location*/ ctx[0].pathname === '/mysettings');
    			add_location(a0, file$2, 18, 1, 497);
    			attr_dev(a1, "href", "/mysettings/myaccount");
    			attr_dev(a1, "class", "tab-button");
    			toggle_class(a1, "active", /*$location*/ ctx[0].pathname === '/mysettings/myaccount');
    			add_location(a1, file$2, 24, 1, 629);
    			attr_dev(a2, "href", "/mysettings/app");
    			attr_dev(a2, "class", "tab-button");
    			toggle_class(a2, "active", /*$location*/ ctx[0].pathname === '/mysettings/app');
    			add_location(a2, file$2, 30, 1, 782);
    			attr_dev(div1, "class", "tab");
    			add_location(div1, file$2, 17, 0, 477);
    			attr_dev(div2, "class", "content-container");
    			add_location(div2, file$2, 38, 0, 926);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(router, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$location*/ 1) {
    				toggle_class(a0, "active", /*$location*/ ctx[0].pathname === '/mysettings');
    			}

    			if (dirty & /*$location*/ 1) {
    				toggle_class(a1, "active", /*$location*/ ctx[0].pathname === '/mysettings/myaccount');
    			}

    			if (dirty & /*$location*/ 1) {
    				toggle_class(a2, "active", /*$location*/ ctx[0].pathname === '/mysettings/app');
    			}

    			const router_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, slide, {});
    					div0_intro.start();
    				});
    			}

    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div2);
    			destroy_component(router);
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
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MySettings', slots, []);
    	let location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(0, $location = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MySettings> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		slide,
    		General,
    		MyAccount,
    		App: App$1,
    		Router: Router$1,
    		Route: Route$1,
    		link,
    		useLocation,
    		location,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 1) {
    			sessionStorage.setItem('lastVisited', $location.pathname);
    		}
    	};

    	return [$location, location];
    }

    class MySettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MySettings",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Routes\PrivateRoutes.svelte generated by Svelte v3.48.0 */

    // (11:0) <Private>
    function create_default_slot$2(ctx) {
    	let protectedroute0;
    	let t0;
    	let protectedroute1;
    	let t1;
    	let protectedroute2;
    	let t2;
    	let protectedroute3;
    	let t3;
    	let protectedroute4;
    	let current;

    	protectedroute0 = new PrivateRoute({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	protectedroute1 = new PrivateRoute({
    			props: { path: "/schedule", component: Schedule },
    			$$inline: true
    		});

    	protectedroute2 = new PrivateRoute({
    			props: { path: "/messages", component: Messages },
    			$$inline: true
    		});

    	protectedroute3 = new PrivateRoute({
    			props: {
    				path: "/employees/*",
    				component: Employees
    			},
    			$$inline: true
    		});

    	protectedroute4 = new PrivateRoute({
    			props: {
    				path: "/mysettings/*",
    				component: MySettings
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
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(protectedroute0.$$.fragment, local);
    			transition_in(protectedroute1.$$.fragment, local);
    			transition_in(protectedroute2.$$.fragment, local);
    			transition_in(protectedroute3.$$.fragment, local);
    			transition_in(protectedroute4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(protectedroute0.$$.fragment, local);
    			transition_out(protectedroute1.$$.fragment, local);
    			transition_out(protectedroute2.$$.fragment, local);
    			transition_out(protectedroute3.$$.fragment, local);
    			transition_out(protectedroute4.$$.fragment, local);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(11:0) <Private>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let private_1;
    	let current;

    	private_1 = new Private({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(private_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(private_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const private_1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    			destroy_component(private_1, detaching);
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
    	validate_slots('PrivateRoutes', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivateRoutes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Private,
    		ProtectedRoute: PrivateRoute,
    		Home,
    		Schedule,
    		Messages,
    		Employees,
    		MySettings
    	});

    	return [];
    }

    class PrivateRoutes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivateRoutes",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Routes\Routes.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\Routes\\Routes.svelte";

    // (20:0) {:else}
    function create_else_block(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
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
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-181k9qi");
    			add_location(main, file$1, 20, 1, 600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
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
    				if_block.m(main, null);
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
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(20:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if $isLoading}
    function create_if_block(ctx) {
    	let div;
    	let loader;
    	let current;

    	loader = new Loader({
    			props: {
    				styles: {
    					outer: /*$primary_color*/ ctx[2],
    					center: /*$secondary_color*/ ctx[3]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loader.$$.fragment);
    			attr_dev(div, "class", "loader svelte-181k9qi");
    			add_location(div, file$1, 16, 1, 484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loader, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loader_changes = {};

    			if (dirty & /*$primary_color, $secondary_color*/ 12) loader_changes.styles = {
    				outer: /*$primary_color*/ ctx[2],
    				center: /*$secondary_color*/ ctx[3]
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
    			if (detaching) detach_dev(div);
    			destroy_component(loader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:0) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {:else}
    function create_else_block_1(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: false,
    				$$slots: { default: [create_default_slot_1] },
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(26:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if $loggedIn}
    function create_if_block_1(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: false,
    				$$slots: { default: [create_default_slot$1] },
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:2) {#if $loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (27:3) <Router primary={false}>
    function create_default_slot_1(ctx) {
    	let publicroutes;
    	let current;
    	publicroutes = new PublicRoutes({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(publicroutes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(publicroutes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(publicroutes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(publicroutes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(publicroutes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(27:3) <Router primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (23:3) <Router primary={false}>
    function create_default_slot$1(ctx) {
    	let privateroutes;
    	let current;
    	privateroutes = new PrivateRoutes({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(privateroutes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(privateroutes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(privateroutes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(privateroutes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(privateroutes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(23:3) <Router primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLoading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $theme;
    	let $loggedIn;
    	let $isLoading;
    	let $primary_color;
    	let $secondary_color;
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(4, $theme = $$value));
    	validate_store(loggedIn, 'loggedIn');
    	component_subscribe($$self, loggedIn, $$value => $$invalidate(0, $loggedIn = $$value));
    	validate_store(isLoading$1, 'isLoading');
    	component_subscribe($$self, isLoading$1, $$value => $$invalidate(1, $isLoading = $$value));
    	validate_store(primary_color, 'primary_color');
    	component_subscribe($$self, primary_color, $$value => $$invalidate(2, $primary_color = $$value));
    	validate_store(secondary_color, 'secondary_color');
    	component_subscribe($$self, secondary_color, $$value => $$invalidate(3, $secondary_color = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);

    	if ($loggedIn) {
    		set_store_value(theme, $theme = localStorage.getItem('savedTheme') || localStorage.getItem('theme'), $theme);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Loader,
    		PublicRoutes,
    		PrivateRoutes,
    		loggedIn,
    		isLoading: isLoading$1,
    		primary_color,
    		secondary_color,
    		theme,
    		$theme,
    		$loggedIn,
    		$isLoading,
    		$primary_color,
    		$secondary_color
    	});

    	return [$loggedIn, $isLoading, $primary_color, $secondary_color];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (31:0) <Notifications>
    function create_default_slot(ctx) {
    	let routes;
    	let current;
    	routes = new Routes({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(routes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(routes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(routes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(routes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(routes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(31:0) <Notifications>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t;
    	let notifications;
    	let current;

    	notifications = new Notifications({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script = element("script");
    			t = space();
    			create_component(notifications.$$.fragment);
    			attr_dev(script, "id", "CookieDeclaration");
    			if (!src_url_equal(script.src, script_src_value = "https://consent.cookiebot.com/c04f56d2-2bf3-4b95-9043-5f1cd5e904ed/cd.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "type", "text/javascript");
    			script.async = true;
    			add_location(script, file, 23, 1, 543);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t, anchor);
    			mount_component(notifications, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const notifications_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				notifications_changes.$$scope = { dirty, ctx };
    			}

    			notifications.$set(notifications_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t);
    			destroy_component(notifications, detaching);
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
    	validate_store(isLoading$1, 'isLoading');
    	component_subscribe($$self, isLoading$1, $$value => $$invalidate(0, $isLoading = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(async () => {
    		set_store_value(isLoading$1, $isLoading = true, $isLoading);
    		const { payload } = await authGet(null);

    		if (payload) {
    			set_store_value(user, $user = payload.user, $user);
    		} else {
    			sessionStorage.removeItem('lastVisited');
    			sessionStorage.removeItem('userId');
    		}

    		set_store_value(isLoading$1, $isLoading = false, $isLoading);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Routes,
    		user,
    		isLoading: isLoading$1,
    		authGet,
    		Notifications,
    		$isLoading,
    		$user
    	});

    	return [];
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
