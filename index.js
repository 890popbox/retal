module.exports = function retaliate(mod) {
		const {command} = mod,
			fs = require('fs');

    let RETALIATE = {
            reserved: 0,
            npc: false,
            type: 1,
            huntingZoneId: 0,
            id: 0
        },
		skillLists = [],
		retal_settings = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8')),
		enabled = retal_settings.enabled,
		delay = retal_settings.delay;

//retal toggles it.. on and off turns it on or off
command.add('retal', (arg) => {
//make sure the arg is valid, if its anything but my commands it will just fall through
		if (arg!==undefined){
		  if (!isNaN(arg)) delay = ((parseInt(arg)>0) ? parseInt(arg) : 0);
	    else if(arg.toLowerCase() === "off") enabled = false;
	    else if(arg.toLowerCase() === "on") enabled = true;
		}
		//write to the config file
		retal_settings.enabled = enabled; retal_settings.delay = delay;
		fs.writeFileSync(__dirname + '/config.json', JSON.stringify(retal_settings));
    command.message((enabled ? 'Enabled,' : 'Disabled,') + ` Delay: ${delay}ms.`);
});

//this figures out what class you are.. (class retal ids are different)
    mod.game.on("enter_game", () => {
//check all skills ids
			mod.queryData("/SkillIconData/Icon@class=?/", [mod.game.me.class], true, false, ["skillId", "iconName"]).then(res => {
            res.forEach(icon => {
                if(["icon_skills.risingattack_tex", "icon_skills.risingattack2_tex", "icon_skills.risingrocket_tex"].includes(icon.attributes.iconName.toLowerCase()) && skillLists.includes(icon.attributes.skillId))
					{
						RETALIATE.id = Math.floor(icon.attributes.skillId/100)*100;
						skillLists = [];
						return;
					}
            });
        });
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
    if ((event.reaction.skill.id !== (mod.game.me.templateId * 100) + 2) || !enabled)
		return;

//cast with or without delay
	setTimeout(retal, delay, event.reaction.w, event.reaction.loc);

    });

//grab all skill IDs on the class you log into
	mod.hook('S_SKILL_LIST', 2, (data) => {
        data.skills.forEach(id => skillLists.push(parseInt(id.id)))
    });

};
