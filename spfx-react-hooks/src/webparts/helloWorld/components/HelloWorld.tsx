import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { SPHttpClient } from "@microsoft/sp-http";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { PrimaryButton, Spinner } from "office-ui-fabric-react";
import { FluentUIAvatar } from "./userAvatar/FluentUIAvatar";
import { NorthstarAvatar } from "./userAvatar/NorthstarAvatar";
import { Provider, teamsTheme } from "@fluentui/react-northstar";

export default function HelloWorld(props: IHelloWorldProps) {
	const [webProperties, setWebProperties] = React.useState();
	const [welcomePage, setWelcomePage] = React.useState();

	let loadInitialData = async () => {
		let response = await props.spContext.spHttpClient.get(
			props.spContext.pageContext.web.absoluteUrl + "/_api/web/allProperties",
			SPHttpClient.configurations.v1
		);
		let webProps = await response.json();

		setWebProperties(webProps);
	};

	React.useEffect(() => {
		loadInitialData();
	}, []);

	let loadWelcomePage = async () => {
		let response = await props.spContext.spHttpClient.get(
			props.spContext.pageContext.web.absoluteUrl + "/_api/web?$select=WelcomePage",
			SPHttpClient.configurations.v1
		);
		let web = await response.json();

		setWelcomePage(web.WelcomePage);
	};

	return (
		<div className={styles.helloWorld}>
			<div className={styles.container}>
				<div className={styles.row}>
					<div className={styles.column}>
						<span className={styles.title}>Welcome to SharePoint!</span>
						{webProperties ? (
							<div data-testid="web-property-div">{webProperties.ThemePrimary}</div>
						) : (
							<Spinner data-testid="loading-spinner" />
						)}
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.column}>
						<span className={styles.title}>Welcome page is</span>
						{welcomePage ? (
							<div data-testid="welcome-page-div">{welcomePage}</div>
						) : (
							<PrimaryButton
								data-testid="load-welcome-page-btn"
								onClick={event => loadWelcomePage()}
								text="Load welcome page"
							/>
						)}
					</div>
				</div>
			</div>
			<div>
				{props.profileManager && (
					<FluentUIAvatar
						profileManager={props.profileManager}
						userId={props.spContext.pageContext.user.loginName}
					/>
				)}
			</div>
			<div>
				{props.profileManager && (
					<Provider theme={teamsTheme}>
						<NorthstarAvatar
							profileManager={props.profileManager}
							userId={props.spContext.pageContext.user.loginName}
						/>
					</Provider>
				)}
			</div>
		</div>
	);
}
