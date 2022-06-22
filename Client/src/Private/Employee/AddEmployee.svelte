<script>
    import MdContentCopy from 'svelte-icons/md/MdContentCopy.svelte'
    import Clipboard from "svelte-clipboard";

    import { notifyError } from "../../utils/notify.js";

    let email;
    let code = '';


    async function generateCode(){
    if(email.length > 0){
        const response = await fetch('/getRegistrationToken/'+email);
        const { token, error } = await response.json();
        if(error) {
            notifyError(error.message);
        }else code = token;
        }
    }


</script>

<div class="container">
    <form on:submit|preventDefault>
        <label for="email">Indtast din medarbejders email</label>
         <input id="email" bind:value={email} placeholder="email" type="email" required>
       
        <p>Du kan vælge at generere en kode</p>
        <button class="w3-button w3-border w3-blue w3-hover-black" on:click="{generateCode}">Genererer Kode</button>
        <p>Eller vi sender en invitation til din medarbejder</p>
        <button class="w3-button w3-border w3-blue w3-hover-black">Send Invitation</button>
    </form>
    {#if code.length > 0}
        <div class="code-container w3-code w3-border">
            <Clipboard text={code} let:copy >
            <div class="copy-icon" on:click={copy}><MdContentCopy/></div> 
                <div >
                {code} 
                </div>
            </Clipboard>
        </div>
    {/if}
</div>

<style>
    .container {
        padding:0 15px; 
    }
    form {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 1fr;
        row-gap: 15px;
    }
    .code-container {
       width:100%;
       height: 170px;
       position: relative;
       padding:0 25px;
        padding-top:30px;
    }

    .copy-icon{
        width:24px;
        height:24px;
        position: absolute;
        right:5px;
        top:5px;
    }
    .copy-icon:hover{
        cursor: pointer;
        transform: scale(.9);
    }
</style>