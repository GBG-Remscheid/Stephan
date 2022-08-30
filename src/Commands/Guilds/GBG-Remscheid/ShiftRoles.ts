import { Category } from "@discordx/utilities";
import type { Collection, GuildMember, Message, Role } from "discord.js";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import type { APIMessage } from "discord-api-types/v10";
import { Snowflake } from "discord-api-types/v10";
import { Discord, Guild, Slash, SlashGroup, SlashOption } from "discordx";

const enum Roles {
    "5a" = "813879297735262299",
    "5b" = "813879337530032188",
    "5c" = "813879359881740298",
    "5d" = "813879398763200554",
    "5er" = "755434201301647380",
    "6a" = "813885168942841896",
    "6b" = "813885287611498527",
    "6c" = "813885359720235008",
    "6d" = "876828582775767041",
    "6er" = "755434171458912356",
    "7a" = "813885651463700500",
    "7b" = "813885716727595018",
    "7c" = "813885764667572327",
    "7d" = "876851320458457160",
    "7er" = "755434140534440076",
    "8a" = "813885864291074079",
    "8b" = "813885924106436658",
    "8c" = "813885977147736064",
    "8d" = "876851408958275655",
    "8er" = "755434101141405797",
    "9a" = "876808321900871760",
    "9b" = "876866717454860299",
    "9c" = "876866762031915029",
    "9d" = "876851442093277224",
    "9er" = "755434011190624307",
    // TODO: create role for 10th class
    /* 
    "10er" = "",
    "10a" = "",
    "10b" = "",
    "10c" = "",
    "10d" = "", 
    */
    "EF" = "755433966500184105",
    "Q1" = "755433930089431061",
    "Q2" = "876808753930965012",
}

@Discord()
@Category("Utilities")
@SlashGroup({ description: "Shifts all members' roles.", name: "role-shift" })
@Guild("755432683579900035")
// @Permission({ id: "755432968901754951", permission: true, type: "ROLE" })
export abstract class RoleShift {
    @Slash({ description: "Shift up the roles of all members.", name: "up" })
    @SlashGroup("role-shift")
    async shiftUp(
        @SlashOption({
            name: "test",
            required: false,
            type: ApplicationCommandOptionType.Boolean,
        })
        test: boolean,

        interaction: CommandInteraction
    ): Promise<void | APIMessage | Message> {
        if (!interaction.guild) {
            return;
        }
        let members: Collection<string, GuildMember> | GuildMember[] =
            await interaction.guild.members.fetch();
        if (test) {
            const me =
                interaction.guild.members.cache.get("463044315007156224");
            const grunow =
                interaction.guild.members.cache.get("428119121423761410");
            if (!me || !grunow) {
                return;
            }
            members = [me, grunow];
        }

        await interaction.reply("Starting to shift roles...");
        // await interaction.deferReply();
        try {
            members.forEach(member => {
                member.roles.cache.map(async (memberRole: Role) => {
                    switch (memberRole.id) {
                        // 5 => 6
                        case Roles["5er"]:
                            member.roles.remove(Roles["5er"]);
                            member.roles.add(Roles["6er"]);
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has(Roles["5a"])) {
                                member.roles.remove(Roles["5a"]);
                                member.roles.add(Roles["6a"]);
                            } else if (member.roles.cache.has(Roles["5b"])) {
                                member.roles.remove(Roles["5b"]);
                                member.roles.add(Roles["6b"]);
                            } else if (member.roles.cache.has(Roles["5c"])) {
                                member.roles.remove(Roles["5c"]);
                                member.roles.add(Roles["6c"]);
                            } else if (member.roles.cache.has(Roles["5d"])) {
                                member.roles.remove(Roles["5d"]);
                                member.roles.add(Roles["6d"]);
                            }
                            break;
                        // 6 => 7
                        case Roles["6er"]:
                            member.roles.remove(Roles["6er"]);
                            member.roles.add(Roles["7er"]);
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has(Roles["6a"])) {
                                member.roles.remove(Roles["6a"]);
                                member.roles.add(Roles["7a"]);
                            } else if (member.roles.cache.has(Roles["6b"])) {
                                member.roles.remove(Roles["6b"]);
                                member.roles.add(Roles["7b"]);
                            } else if (member.roles.cache.has(Roles["6c"])) {
                                member.roles.remove(Roles["6c"]);
                                member.roles.add(Roles["7c"]);
                            } else if (member.roles.cache.has(Roles["6d"])) {
                                member.roles.remove(Roles["6d"]);
                                member.roles.add(Roles["7d"]);
                            }
                            break;
                        // 7 => 8
                        case Roles["7er"]:
                            member.roles.remove(Roles["7er"]);
                            member.roles.add(Roles["8er"]);
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has(Roles["7a"])) {
                                member.roles.remove(Roles["7a"]);
                                member.roles.add(Roles["8a"]);
                            } else if (member.roles.cache.has(Roles["7b"])) {
                                member.roles.remove(Roles["7b"]);
                                member.roles.add(Roles["8b"]);
                            } else if (member.roles.cache.has(Roles["7c"])) {
                                member.roles.remove(Roles["7c"]);
                                member.roles.add(Roles["8c"]);
                            } else if (member.roles.cache.has(Roles["7d"])) {
                                member.roles.remove(Roles["7d"]);
                                member.roles.add(Roles["8d"]);
                            }
                            break;
                        // 8 => 9
                        case Roles["8er"]:
                            member.roles.remove(Roles["8er"]);
                            member.roles.add(Roles["9er"]);
                            /**
                             * Checks for individual classes from A to D
                             */
                            if (member.roles.cache.has(Roles["8a"])) {
                                member.roles.remove(Roles["8a"]);
                                member.roles.add(Roles["9a"]);
                            } else if (member.roles.cache.has(Roles["8b"])) {
                                member.roles.remove(Roles["8b"]);
                                member.roles.add(Roles["9b"]);
                            } else if (member.roles.cache.has(Roles["8c"])) {
                                member.roles.remove(Roles["8c"]);
                                member.roles.add(Roles["9c"]);
                            } else if (member.roles.cache.has(Roles["8d"])) {
                                member.roles.remove(Roles["8d"]);
                                member.roles.add(Roles["9d"]);
                            }
                            break;
                        // 9 => EF
                        case Roles["9er"]:
                            await member.roles.remove([
                                Roles["9a"],
                                Roles["9b"],
                                Roles["9c"],
                                Roles["9d"],
                            ]);
                            await member.roles.remove(Roles["9er"]);
                            member.roles.add(Roles["EF"]);
                            break;
                        // EF => Q1
                        case Roles["EF"]:
                            member.roles.remove(Roles["EF"]);
                            member.roles.add(Roles["Q1"]);
                            break;
                        // Q1 => Q2
                        case Roles["Q1"]:
                            member.roles.remove(Roles["Q1"]);
                            member.roles.add(Roles["Q2"]);
                            break;
                        // Q2 => Abi XXXX
                        case Roles["Q2"]:
                            member.roles.remove(Roles["Q2"]);
                            /**
                             * Checks if a role is already present for the current year and if not,
                             * it creates a role with the `Abi 20xxx` schema and assigns it to all students that finished.
                             */
                            const abiRole = interaction.guild?.roles.cache.find(
                                role =>
                                    role.name ===
                                    `Abi ${new Date().getFullYear()}`
                            );
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
                });
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply(
                "There was an error while shifting the roles."
            );
        }
        return interaction.editReply("All roles got shifted successfully.");
    }

    @Slash({ description: "Edit a specific user's roles.", name: "down" })
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
        @SlashOption({
            description: "The specific user that should be downshifted.",
            name: "user",
            type: ApplicationCommandOptionType.User,
        })
        user: Snowflake,

        @SlashOption({
            description: "The role, that should be removed.",
            name: "remove",
            type: ApplicationCommandOptionType.Role,
        })
        remRole1: Snowflake,

        @SlashOption({
            description: "The role, that should be added.",
            name: "add",
            required: false,
            type: ApplicationCommandOptionType.Role,
        })
        addRole1: Snowflake,

        @SlashOption({
            description: "A second optional role, that should be removed.",
            name: "remove-optional",
            required: false,
            type: ApplicationCommandOptionType.Role,
        })
        remRole2: Snowflake,

        @SlashOption({
            description: "A second optional role, that should be added.",
            name: "add-optional",
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
