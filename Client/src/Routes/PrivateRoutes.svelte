<script>
  import Private from "../Layouts/Private.svelte";
  // import ProtectedRoute from "./ProtectedRoute.svelte";
import ProtectedRoute from "./Guard/PrivateRoute.svelte";
  import Home from "../Private/Home.svelte";
  import Schedule from "../Private/Schedule.svelte";
  import Messages from "../Private/Messages.svelte";
  import Employees from "../Private/Employees.svelte";
  import MySettings from "../Private/MySettings.svelte";
</script>

<Private>
    <ProtectedRoute path="/" component={Home} />
    <ProtectedRoute path="/schedule" component={Schedule} />
    <ProtectedRoute path="/messages" component={Messages} />
    <ProtectedRoute path="/employees/*" component={Employees} />
    <ProtectedRoute path="/mysettings" component={MySettings} />
</Private>