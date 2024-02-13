import { mergeClasses, Link, Button, Spinner } from "@fluentui/react-components";
import * as React from "react";
import { INavigationNode } from "../model/INavigationNode";
import { useNavigationStyles } from "./NavigationStyles";
import { ChevronDown16Regular } from "@fluentui/react-icons";

export function NavigationNode(props: {
    node: INavigationNode;
    onRequestChildNodes: (node: INavigationNode) => Promise<INavigationNode[]>;
    onNodeClick?: (node: INavigationNode) => void;
    nodeComponent?: React.ComponentType<{ node: INavigationNode }>;
    navigationNodeClass?: string;
}) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [childNodes, setChildNodes] = React.useState<INavigationNode[]>([]);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const classNames = useNavigationStyles();

    const loadChildNodes = async () => {
        if (childNodes.length === 0) {
            setIsLoading(true);
            const data = await props.onRequestChildNodes(props.node);
            setChildNodes(data);
        }
        setIsLoading(false);
        setIsExpanded(true);
    }


    return <li className={mergeClasses(classNames.navigationNode, props.navigationNodeClass, isExpanded ? classNames.navigationNodeSelected : "")}>
        <div className={classNames.linkAndButtonWrapper}>
            {props.nodeComponent ? <props.nodeComponent node={props.node} /> : <Link onClick={(e) => {
                if (props.onNodeClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onNodeClick(props.node);
                    return false;
                }
            }} href={props.node.url}>{props.node.title}</Link>}
            {props.node.childCount > 0 && <Button
                appearance="transparent"
                data-testId="expand-button"
                icon={isLoading ? <Spinner size="extra-tiny" /> : <ChevronDown16Regular style={{
                    transition: `transform 0.2s ease-in-out`,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                }} />}
                onClick={() => isExpanded ? setIsExpanded(false) : loadChildNodes()} />}
        </div>
        {childNodes.length > 0 && isExpanded && <ul className={classNames.itemsContainer}>
            {childNodes.map((node, index) => {
                return <NavigationNode key={index} node={node} onRequestChildNodes={props.onRequestChildNodes} />
            })}
        </ul>}
    </li>
}