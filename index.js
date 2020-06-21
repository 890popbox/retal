module.exports = function retaliate(mod) {
	const {command} = mod,
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
            181000 // Valkyrie
        ];

    let RETALIATE = {
            reserved: 0,
            npc: false,
            type: 1,
            huntingZoneId: 0,
            id: 0
        },
		delay = 0,
		w,
        loc,
        dest,
        job,
        templateId,
		enabled = false;

//retal toggles it.. on and off turns it on or off
command.add('retal', (arg) => {
    if (arg === undefined) enabled = !enabled;
	else if (!isNaN(arg)) delay = parseInt(arg);
    else if(arg.toLowerCase() === "off") enabled = false;
    else if(arg.toLowerCase() === "on") enabled = true;
    command.message((enabled ? 'Enabled,' : 'Disabled,') + ` Delay: ${delay}ms.`);
});

//this figures out what class you are.. (class retal ids are different)
    mod.game.on('enter_game', () =>  {
		templateId = mod.game.me.templateId;
        job = (templateId - 10101) % 100;
        RETALIATE.id = RETALIATE_IDs[job];
    });

//this is a function that will cast your retal skill for you, it passes in a w,loc
    const retal = (w, loc) => {
        mod.send('C_START_SKILL', 7, {
            skill: RETALIATE,
            w: w,
            loc: loc,
            dest: {x:0,y:0,z:0},
            unk: true,
            moving: false,
            cont: false,
            target: 0,
            unk2: false
            }
        );
    }

    mod.hook('S_EACH_SKILL_RESULT', 14, (event) => {

//make sure that it is enabled or not.. and using right skill
    if ((event.reaction.skill.id !== (templateId * 100) + 2) || !enabled)
		return;

//cast with or without delay
	setTimeout(retal, delay, event.reaction.w, event.reaction.loc);

    });
};
