module.exports = function retaliate(mod) {
const {command} = mod;

    let RETALIATE = {
            reserved: 0,
            npc: false,
            type: 1,
            huntingZoneId: 0,
            id: 0
        },
        RETALIATE_IDs = [
            131000, // Warrior
            111000, // Lancer
            101000, // Slayer
            103000, // Berserker
            141000, // Sorcerer
            141000, // Archer
            251000, // Priest
            211000, // Mystic
            140300, // Reaper
            201000, // Gunner
            121000, // Brawler
            101000, // Ninja
            181099, // Valkyrie
        ];

    let w,
        loc,
        dest,
        job,
        templateId,
		enabled = true;

//retal toggles it.. on and off turns it on or off
command.add('retal', (arg) => {
        if (arg === undefined) {
            enabled = !enabled;
            command.message((enabled ? 'Enabled' : 'Disabled') + '.');
        }
		else if(arg.toLowerCase() === "off")
        {
            enabled = false;
            command.message((enabled ? 'Enabled' : 'Disabled') + '.');
        }
        else if(arg.toLowerCase() === "on")
        {
            enabled = true;
            command.message((enabled ? 'Enabled' : 'Disabled') + '.');
        }
});

    mod.hook('S_LOGIN', 14, (event) => {
        job = (event.templateId - 10101) % 100;
        RETALIATE.id = RETALIATE_IDs[job];
        templateId = event.templateId;
    });

    mod.hook('C_PLAYER_LOCATION', 5, (event) => {
        w = event.w;
        loc = event.loc;
        dest = event.dest;
    });

    mod.hook('S_EACH_SKILL_RESULT', 14, (event) => {
        if (event.reaction.skill.id !== (templateId * 100) + 2)
            return;
//toggle it on and off
        if(enabled===true){
        mod.send('C_START_SKILL', 7, {
                skill: RETALIATE,
                w: w,
                loc: loc,
                dest: dest,
                unk: true,
                moving: false,
                cont: false,
                target: 0,
                unk2: false
            }
        );
		}
		
		
    });
};
