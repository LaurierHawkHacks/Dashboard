import { Button, TextInput } from "@components";

export const CompleteProfilePage = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-semibold leading-7 text-gray-900 py-10">
                    Complete Your Profile
                </h1>
                <form>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <TextInput
                                    label="First name"
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <TextInput
                                    label="Last name"
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <TextInput
                                    label="Email address"
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Country
                                </label>
                                <div className="mt-2">
                                    {/* TODO: update this select to the proper select component */}
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* just a separator line */}
                    <div className="h-0.5 bg-tbrand my-6"></div>
                    <div className="flex items-center justify-end gap-x-6 px-4 py-4 sm:px-8">
                        <Button type="reset" intent="secondary">
                            Clear
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
