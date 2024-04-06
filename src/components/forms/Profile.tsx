import { TextInput, Select, MultiSelect } from "@components";
import {
    ages,
    countryNames,
    schools,
    levelsOfStudy,
    cityNames,
    majorsList,
} from "@data";

import type { UserProfile } from "@/services/utils/types";
import type { ApplicationInputKeys } from "@/components/forms/types";

export const Profile = ({
    profile,
    handler,
}: {
    profile: UserProfile;
    handler: (name: ApplicationInputKeys, data: string | string[]) => void;
}) => {
    return (
        <>
            <div className="sm:col-span-3">
                <TextInput
                    label="What is your first name?"
                    type="text"
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="Steven"
                    value={profile.firstName}
                    onChange={(e) => handler("firstName", e.target.value)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                    label="What is your last name?"
                    type="text"
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Wu"
                    value={profile.lastName}
                    onChange={(e) => handler("lastName", e.target.value)}
                    required
                />
            </div>

            <div className="sm:col-span-2">
                <Select
                    label="How old are you?"
                    options={ages}
                    initialValue={profile.age}
                    onChange={(opt) => handler("age", opt)}
                    required
                />
            </div>
            <div className="sm:col-span-5"></div>
            <div className="col-span-3">
                <TextInput
                    label="What is your phone number?"
                    id="phone-number"
                    placeholder="(999) 999-9999"
                    value={profile.phone}
                    onChange={(e) => handler("phone", e.target.value)}
                    description="US/CA numbers only"
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                    label="What is your Discord username?"
                    id="discord"
                    placeholder="@username or username#1234"
                    value={profile.discord}
                    onChange={(e) => handler("discord", e.target.value)}
                    description="Discord will be our primary form of communication."
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Which country do you currently reside in?"
                    options={countryNames}
                    initialValue={profile.countryOfResidence}
                    onChange={(opt) => handler("countryOfResidence", opt)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Which city do you live in?"
                    options={cityNames}
                    initialValue={profile.city}
                    onChange={(opt) => handler("countryOfResidence", opt)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Which school are you currently attending?"
                    options={schools}
                    initialValue={profile.school}
                    onChange={(opt) => handler("school", opt)}
                    required
                />
            </div>
            <div className="sm:col-span-3">
                <Select
                    label="What is your current level of study?"
                    options={levelsOfStudy}
                    initialValue={profile.levelOfStudy}
                    onChange={(opt) => handler("levelOfStudy", opt)}
                    required
                />
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="What is your major/field of study?"
                    options={majorsList}
                    onChange={(opts) => handler("major", opts)}
                    allowCustomValue
                    required
                />
            </div>
        </>
    );
};
