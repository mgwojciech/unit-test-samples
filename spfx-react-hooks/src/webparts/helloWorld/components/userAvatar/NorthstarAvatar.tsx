import { Avatar } from "@fluentui/react-northstar/dist/es/components/Avatar/Avatar";
import { Card } from "@fluentui/react-northstar/dist/es/components/Card/Card";
import { Flex } from "@fluentui/react-northstar/dist/es/components/Flex/Flex";
import { Loader } from "@fluentui/react-northstar/dist/es/components/Loader/Loader";
import { Text } from "@fluentui/react-northstar/dist/es/components/Text/Text";
import * as React from "react";
import { IProfile } from "../../../../model/IProfile";
import { IAvatarProps } from "./IAvatarProps";

export function NorthstarAvatar(props: React.PropsWithChildren<IAvatarProps>) {
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
				return "success";
			case "Away":
				return "warning";
			case "DoNotDisturb":
				return "error";
			case "Busy":
				return "error";
			default:
				return "unknown";
		}
	};
	if (loading) {
		return <Loader />;
	}
	return (
		<Card data-testid="northstar-avatar" aria-roledescription="card avatar">
			<Card.Header fitted>
				<Flex gap="gap.small">
					<Avatar
						image={profile.imgSrc}
						label={profile.displayName}
						name={profile.displayName}
						status={mapGraphPresence(profile.presence)}
					/>
					<Flex column>
						<Text content={profile.displayName} weight="bold" />
						<Text content={profile.jobTitle} size="small" />
					</Flex>
				</Flex>
			</Card.Header>
		</Card>
	);
}
