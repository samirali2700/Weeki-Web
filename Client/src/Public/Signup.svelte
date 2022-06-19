<script>
    import { Router, Route } from "svelte-navigator";
    
    import Intro from "./Signup/Intro.svelte";
    import Create from "./Signup/Create.svelte";
    import Join from "./Signup/Join.svelte";


</script>

<Router primary={false}>
  <div class="container">
      <div class="content signup-parent">
        <Route path="/"><Intro/></Route>
        <Route path="create"><Create/></Route>
        <Route path="join"><Join/></Route>
      </div>
  </div>
</Router>

<style>
    .container {
        position: relative;
    }
    .signup-parent :global(.card) {
      border: 1px solid #dddddd;
      cursor: pointer;
      padding: 15px 10px;
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      margin-bottom: 5px;
    }
    .signup-parent :global(.title) {
      margin-bottom: 25px;
    }
    .signup-parent :global(.text) {
      font-family: "Gluten", cursive;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .signup-parent :global(.bold-text) {
      user-select: none;
      font-family: "Allerta Stencil", Sans-serif;
    }
    .signup-parent :global(.content) {
      width: 100%;
    }
    .signup-parent :global(.inputs) {
      margin-bottom: 15px;
      width: 100%;
      height: 40px;
      padding-left: 15px;
      margin-top: 3px;
      font-size: 12px;
    }
    .signup-parent :global(.button) {
      background-color: #0088ff;
      color: #fff;
      margin-top: 25px;
    }
  </style>