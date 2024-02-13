import * as React from "react";
import { INavigationNode } from "../model/INavigationNode";
import { INavigationService } from "../services/navigation/INavigationService";
import { mergeClasses} from "@fluentui/react-components";
import { NavigationNode } from "./NavigationNode";
import { useNavigationStyles } from "./NavigationStyles";

export interface INavigationProps {
    navigationService: INavigationService;
    onNodeClick?: (node: INavigationNode) => void;
    nodeComponent?: React.ComponentType<{ node: INavigationNode }>;
    classNames?: {
        root?: string;
        rootItemsContainer?: string;
        navigationNode?: string;
    }
}



export function Navigation(props: INavigationProps) {
    const [navigationNodes, setNavigationNodes] = React.useState<INavigationNode[]>([]);
    const classNames = useNavigationStyles();
    const loadNavigationNodes = (node?: INavigationNode) => {
        props.navigationService.getNavigationNodes(node).then((data) => {
            setNavigationNodes(data);
        });
    }
    React.useEffect(() => {
        loadNavigationNodes();
    }, []);

    return (
        <nav className={mergeClasses(classNames.root, props.classNames?.root)}>
            <ul className={mergeClasses(classNames.rootItemsContainer, props.classNames?.rootItemsContainer)} style={{
                top: 0
            }}>
                {navigationNodes.map((node, index) => {
                    return <NavigationNode onNodeClick={props.onNodeClick}
                        key={index}
                        node={node}
                        navigationNodeClass={props.classNames?.navigationNode}
                        onRequestChildNodes={async (node) => {
                            return await props.navigationService.getNavigationNodes(node);
                        }} />
                })}
            </ul>
        </nav>
    )
}
