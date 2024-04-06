import { TextInput, Select } from "@components";
import { ages, countryNames, schools, levelsOfStudy } from "@data";

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
                    label="First name"
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
                    label="Last name"
                    type="text"
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Wu"
                    value={profile.lastName}
                    onChange={(e) => handler("lastName", e.target.value)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Age"
                    options={ages}
                    initialValue={profile.age}
                    onChange={(opt) => handler("age", opt)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Country"
                    options={countryNames}
                    initialValue={profile.countryOfResidence}
                    onChange={(opt) => handler("countryOfResidence", opt)}
                    required
                />
            </div>

            <div className="col-span-6">
                <TextInput
                    label="Phone Number"
                    id="phone-number"
                    placeholder="(999) 999-9999"
                    value={profile.phone}
                    onChange={(e) => handler("phone", e.target.value)}
                    description="US/CA numbers only"
                    required
                />
            </div>

            <div className="col-span-3">
                <Select
                    label="School"
                    options={schools}
                    initialValue={profile.school}
                    onChange={(opt) => handler("school", opt)}
                    required
                />
            </div>
            <div className="col-span-3">
                <Select
                    label="Level of Study"
                    options={levelsOfStudy}
                    initialValue={profile.levelOfStudy}
                    onChange={(opt) => handler("levelOfStudy", opt)}
                    required
                />
            </div>

            <div className="sm:col-span-full">
                <TextInput
                    label="Discord username"
                    id="discord"
                    placeholder="@username or username#1234"
                    value={profile.discord}
                    onChange={(e) => handler("discord", e.target.value)}
                    required
                />
            </div>
        </>
    );
};
