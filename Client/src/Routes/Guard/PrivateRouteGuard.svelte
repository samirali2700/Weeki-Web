<script>
    import { loggedIn } from "../../Stores/user";
    
</script>


{#if $loggedIn}
    <slot/>
{/if}