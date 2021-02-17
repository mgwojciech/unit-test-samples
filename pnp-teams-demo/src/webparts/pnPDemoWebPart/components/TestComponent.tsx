import * as React from "react";
import { Segment, Loader } from '@fluentui/react-northstar';

export function TestComponent(props?) {
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }, []);
    return <div>
        <Segment content="Some test div content" />
        <div>
            {loading && <Loader />}
        </div>
    </div>;
}