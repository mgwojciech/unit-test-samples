import * as React from "react";
import { IAvatarProps } from "./IAvatarProps";
import { IProfile } from "../../../../model/IProfile";
import { Persona, PersonaPresence } from "office-ui-fabric-react/lib/components/Persona";
import { Spinner } from "office-ui-fabric-react/lib/components/Spinner/Spinner";

export function FluentUIAvatar(props: React.PropsWithChildren<IAvatarProps>) {
	const [loading, setLoading] = React.useState(true);
	const [profile, setProfile] = React.useState<IProfile>();
	React.useEffect(() => {
		props.profileManager.getUserProfile(props.userId).then(resultProfile => {
			setProfile(resultProfile);
			setLoading(false);
		});
	}, []);
	const mapGraphPresence = (presence: string) => {
		switch (presence) {
			case "Available":
				return PersonaPresence.online;
			default:
				return PersonaPresence[profile.presence.toLocaleLowerCase()];
		}
	};

	if (loading) {
		return <Spinner />;
	} else {
		return (
			<Persona
				data-testid="fluent-ui-avatar"
				imageUrl={profile.imgSrc}
				text={profile.displayName}
				secondaryText={profile.jobTitle}
				tertiaryText={profile.presence}
				presence={mapGraphPresence(profile.presence)}
			/>
		);
	}
}
