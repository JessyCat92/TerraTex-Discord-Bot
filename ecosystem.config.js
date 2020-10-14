module.exports = {
    apps : [{
        name: "discord_bot_tt",
        script: "src/app.ts",
        interpreter: "node",
        node_args: "--require ts-node/register --require tsconfig-paths/register"
    }]
};
