# forza.js

A simple JavaScript library for receiving Forza telemetry data
Compatible with Forza Motorsport 7 and Forza Horizon 4 and 5

## Usage

1. Install the module with `npm install MatthewCash/forza.js`
2. Enable "Data Out" in Forza Settings
    - This is usually near the bottom of `HUD AND GAMEPLAY`
    - Set IP adress to `127.0.0.1` and port to
      | Game | Port |
      | ------------------ | ---- |
      | Forza Motorsport 7 | 9917 |
      | Forza Horizon 4 | 9924 |
      | Forza Horizon 5 | 9925 |
3. If you are using Forza from the Windows Store follow the instructions in [Network Isolation](#network-isolation)
4. Import the module in your code with

```ts
import forza from 'forza.js';
```

5. Instantiate the Forza class

```ts
const forza = new Forza();
```

6. Load games and start UDP sockets

```ts
await forza.loadGames();
forza.startAllGameSockets();
```

### Now you can use the Forza class to receive telemetry data

Get the latest telemetry data

```ts
const telemetry = await forza.getTelemetry();
```

Listen for telemetry data

```ts
forza.on('telemetry', data => {
    // Do something with data
    console.log(data);
});
```

## Network Isolation

Windows store apps prevent localhost connections by default for "security"
This will need to be disabled for this program to work

Thankfully it can be done on a per-app basis

Steam/Linux players will not have to do this

Run this corresponding powershell command for your game

### Forza Motorsport 7:

```
CheckNetIsolation.exe LoopbackExempt -a -n="microsoft.apollobasegame_1.174.4791.2_x64__8wekyb3d8bbwe"
```

### Forza Horizon 4:

```
CheckNetIsolation.exe LoopbackExempt -a -n="microsoft.sunrisebasegame_8wekyb3d8bbwe"
```

### Forza Horizon 5:

```
CheckNetIsolation.exe LoopbackExempt -a -n="microsoft.624F8B84B80_8wekyb3d8bbwe"
```
