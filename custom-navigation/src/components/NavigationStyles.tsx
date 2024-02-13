import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useNavigationStyles = makeStyles({
    root: {
        width: "100%",
        height: "54px",
        backgroundColor: tokens.colorNeutralBackground2,
        zIndex: 10
    },
    rootItemsContainer: {
        display: "flex",
        listStyleType: "none",
        justifyItems: "space-between",
        alignContent: "center",
        top: "40px",
        position: "absolute",
        zIndex: 10
    },
    itemsContainer: {
        display: "flex",
        flexDirection: "column",
        listStyleType: "none",
        justifyItems: "space-between",
        alignContent: "center",
        top: "40px",
        position: "absolute",
        zIndex: 10
    },
    navigationNode: {
        backgroundColor: tokens.colorNeutralBackground2,
        display: "flex",
        flexDirection: "column",
        listStyleType: "none",
        justifyItems: "space-between",
        alignContent: "center",
        verticalAlign: "middle",
        position: "relative",
        minWidth: "200px",
        lineHeight: "2",
        ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXS),
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    },
    linkAndButtonWrapper:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    navigationNodeSelected: {
        backgroundColor: tokens.colorNeutralBackground1Selected
    }
});