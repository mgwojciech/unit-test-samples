import { makeStyles } from "@fluentui/react-components";

export const useSearchClassNames = makeStyles({
    grid:{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gridGap: "1rem"
    },
}) 