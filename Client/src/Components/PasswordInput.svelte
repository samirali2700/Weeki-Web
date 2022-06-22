<script>
    import IoIosEye from 'svelte-icons/io/IoIosEye.svelte'
    import IoIosEyeOff from 'svelte-icons/io/IoIosEyeOff.svelte'
    export let password = '';
    export let id = 'password';
    export let error = false;
    let toggled = false;

    $: icon = toggled ? IoIosEyeOff : IoIosEye;
</script>


{#if toggled}
    <input id={id} class="w3-card-2 inputs" class:error={error} type="text" bind:value={password} required on:input/>
{:else}
    <input id={id} class="w3-card-2 inputs" class:error={error} type="password" bind:value={password} required on:input/>
{/if}
    <div class="toggle-password" on:click="{() => toggled = !toggled}">
        <svelte:component this={icon} />
    </div>
<style>
    .toggle-password {
        width: 22px;
        position: relative;
        top: -3.4em;
        left: 90%;
    }
    .toggle-password:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
</style>