import type { APIMessage, Snowflake } from "discord-api-types/v10";
import {
    ApplicationCommandOptionType,
    CommandInteraction,
    Message,
    Role,
} from "discord.js";
import { Discord, Guild, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";

@Discord()
@Category("Utilities")
@SlashGroup({ description: "Shifts all members' roles.", name: "role-shift" })
@Guild("755432683579900035")
// @Permission({ id: "755432968901754951", permission: true, type: "ROLE" })
export abstract class RoleShift {
    @Slash("up", { description: "Shift up the roles of all members." })
    @SlashGroup("role-shift")
    async shiftUp(
        interaction: CommandInteraction
    ): Promise<void | APIMessage | Message> {
        await interaction.reply("Starting to shift roles...");
        await interaction.deferReply();
        try {
            interaction.guild?.members.cache.map(member =>
                /* This is only for testing purposes */
                // const members: GuildMember[] = [];
                // members.push(interaction.guild.members.cache.get('463044315007156224'))
                // members.push(interaction.guild.members.cache.get('428119121423761410'))
                // members.map((member) =>
                member.roles.cache.map(async (memberRole: Role) => {
                    switch (memberRole.id) {
                        // 5 => 6
                        case "755434201301647380":
                            member.roles.remove("755434201301647380");
                            member.roles.add("755434171458912356");
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has("813879297735262299")) {
                                member.roles.remove("813879297735262299");
                                member.roles.add("813885168942841896");
                            } else if (
                                member.roles.cache.has("813879337530032188")
                            ) {
                                member.roles.remove("813879337530032188");
                                member.roles.add("813885287611498527");
                            } else if (
                                member.roles.cache.has("813879359881740298")
                            ) {
                                member.roles.remove("813879359881740298");
                                member.roles.add("813885359720235008");
                            } else if (
                                member.roles.cache.has("813879398763200554")
                            ) {
                                member.roles.remove("813879398763200554");
                                member.roles.add("876828582775767041");
                            }
                            break;
                        // 6 => 7
                        case "755434171458912356":
                            member.roles.remove("755434171458912356");
                            member.roles.add("755434140534440076");
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has("813885168942841896")) {
                                member.roles.remove("813885168942841896");
                                member.roles.add("813885651463700500");
                            } else if (
                                member.roles.cache.has("813885287611498527")
                            ) {
                                member.roles.remove("813885287611498527");
                                member.roles.add("813885716727595018");
                            } else if (
                                member.roles.cache.has("813885359720235008")
                            ) {
                                member.roles.remove("813885359720235008");
                                member.roles.add("813885764667572327");
                            } else if (
                                member.roles.cache.has("876828582775767041")
                            ) {
                                member.roles.remove("876828582775767041");
                                member.roles.add("876851320458457160");
                            }
                            break;
                        // 7 => 8
                        case "755434140534440076":
                            member.roles.remove("755434140534440076");
                            member.roles.add("755434101141405797");
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has("813885651463700500")) {
                                member.roles.remove("813885651463700500");
                                member.roles.add("813885864291074079");
                            } else if (
                                member.roles.cache.has("813885716727595018")
                            ) {
                                member.roles.remove("813885716727595018");
                                member.roles.add("813885924106436658");
                            } else if (
                                member.roles.cache.has("813885764667572327")
                            ) {
                                member.roles.remove("813885764667572327");
                                member.roles.add("813885977147736064");
                            } else if (
                                member.roles.cache.has("876851320458457160")
                            ) {
                                member.roles.remove("876851320458457160");
                                member.roles.add("876851408958275655");
                            }
                            break;
                        // 8 => 9
                        case "755434101141405797":
                            member.roles.remove("755434101141405797");
                            member.roles.add("755434011190624307");
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has("813885864291074079")) {
                                member.roles.remove("813885864291074079");
                                member.roles.add("876808321900871760");
                            } else if (
                                member.roles.cache.has("813885924106436658")
                            ) {
                                member.roles.remove("813885924106436658");
                                member.roles.add("876866717454860299");
                            } else if (
                                member.roles.cache.has("813885977147736064")
                            ) {
                                member.roles.remove("813885977147736064");
                                member.roles.add("876866762031915029");
                            } else if (
                                member.roles.cache.has("876851408958275655")
                            ) {
                                member.roles.remove("876851408958275655");
                                member.roles.add("876851442093277224");
                            }
                            break;
                        // 9 => EF
                        case "755434011190624307":
                            await member.roles.remove([
                                "876808321900871760",
                                "876866717454860299",
                                "876866762031915029",
                                "876851442093277224",
                            ]);
                            await member.roles.remove("755434011190624307");
                            member.roles.add("755433966500184105");
                            break;
                        // EF => Q1
                        case "755433966500184105":
                            member.roles.remove("755433966500184105");
                            member.roles.add("755433930089431061");
                            break;
                        // Q1 => Q2
                        case "755433930089431061":
                            member.roles.remove("755433930089431061");
                            member.roles.add("876808753930965012");
                            break;
                        // Q2 => Abi XXXX
                        case "876808753930965012":
                            member.roles.remove("876808753930965012");
                            /**
                             * Checks if a role is already present for the current year and if not,
                             * it creates a role with the `Abi 20xxx` schema and assigns it to all students that finished.
                             */
                            const abiRole =
                                interaction.guild?.roles.cache.find(
                                    role =>
                                        role.name ===
                                        `Abi ${new Date().getFullYear()}`
                                ) || null;
                            if (
                                interaction.guild?.roles.cache.find(
                                    role =>
                                        role.name ===
                                        `Abi ${new Date().getFullYear()}`
                                )
                            ) {
                                if (abiRole) {
                                    member.roles.add(abiRole);
                                }
                            } else {
                                if (interaction.guild) {
                                    const newAbiRole =
                                        await interaction.guild.roles.create({
                                            color: "Random",
                                            name: `Abi ${new Date().getFullYear()}`,
                                        });
                                    member.roles.add(newAbiRole);
                                }
                            }
                            break;
                        default:
                            return interaction.editReply(
                                "Roles are shifting..."
                            );
                    }
                })
            );
        } catch (error) {
            return interaction.editReply(
                "There was an error while shifting the roles."
            );
        }
        return interaction.editReply("All roles got shifted successfully.");
    }

    @Slash("down", { description: "Edit a specific user's roles." })
    @SlashGroup("role-shift")
    /**
     * Shifts down a specific user's roles
     * @param {User} user The user whose roles should be downshifted
     * @param {Role} remRole1 The role, that should be removed
     * @param {Role} addRole1 The role, that should be added
     * @param {Role} remRole2 A second optional role, that should be removed
     * @param {Role} addRole2 A second optional role, that should be added
     * @param {CommandInteraction} interaction The interaction of the command
     */
    async shiftDown(
        @SlashOption("user", {
            description: "The specific user that should be downshifted.",
            type: ApplicationCommandOptionType.User,
        })
        user: Snowflake,

        @SlashOption("remove", {
            description: "The role, that should be removed.",
            type: ApplicationCommandOptionType.Role,
        })
        remRole1: Snowflake,

        @SlashOption("add", {
            description: "The role, that should be added.",
            required: false,
            type: ApplicationCommandOptionType.Role,
        })
        addRole1: Snowflake,

        @SlashOption("remove-opt", {
            description: "A second optional role, that should be removed.",
            required: false,
            type: ApplicationCommandOptionType.Role,
        })
        remRole2: Snowflake,

        @SlashOption("add-opt", {
            description: "A second optional role, that should be added.",
            required: false,
            type: ApplicationCommandOptionType.Role,
        })
        addRole2: Snowflake,

        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.reply("Roles are shifting...");
        try {
            const member = interaction.guild?.members.cache.get(user);

            const addRoles = [];
            const remRoles = [];

            if (remRole1) {
                remRoles.push(remRole1);
            }
            if (remRole2) {
                remRoles.push(remRole2);
            }

            if (addRole1) {
                addRoles.push(addRole1);
            }
            if (addRole2) {
                addRoles.push(addRole2);
            }

            if (member) {
                await member.roles.remove(remRoles);
                if (addRoles.length) {
                    await member.roles.add(addRoles);
                }
            }

            interaction.editReply("All roles got shifted successfully.");
        } catch (error) {
            interaction.editReply(
                "There was an error while shifting the roles."
            );
            console.error(error);
        }
    }
}
