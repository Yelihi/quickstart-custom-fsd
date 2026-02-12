import kleur from "kleur";

// interface
import { OutputPrint } from "../interface";


export const help = () => {
    console.log(`
        custom-fsd <command>

        Usage:
            custom-fsd                  Create project (interactive)
            custom-fsd create           Create project (interactive)
            custom-fsd add <kind> <name>
            
        Help:
            custom-fsd --help           Show help
            custom-fsd -h               Show help
        
        Explains:
            <command>                   Command to run
            <kind>                      Kind of the component
            <name>                      Name of the component 
        `.trim());
}

export const output = (outputPrint: OutputPrint) => {
    console.log(`
        
        ${kleur.green(`✔ Project created`)}
        
        cd ${outputPrint.projectName}
        ${outputPrint.pmInstall} ${outputPrint.pmInstallArgs.join(" ")}
        ${outputPrint.pmRun} ${outputPrint.pmRunArgs.join(" ")} dev
        
        `.trim())
}
