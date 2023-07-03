import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import * as React from "react";
import { useSPContext } from "../context/SPAppContext";
import { Spinner, Image } from "@fluentui/react-components";

export type SiteInfoProps = {

}

export function SiteInfo(props: SiteInfoProps) {
    const { spContext, spClient, isContextLoaded } = useSPContext();
    const [webLogo, setWebLogo] = React.useState<string>();

    const getWebLogo = async () => {
        if (isContextLoaded) {
            const url = `/_api/web/getFileByServerRelativeUrl('${spContext?.webLogoUrl}')/$value`
            const response = await spClient?.get(url!,{
                headers: {
                    "Accept": "image/jpeg"
                }
            });
            //@ts-ignore
            const binaryData = await response?.arrayBuffer();
            let base64String = btoa(
                new Uint8Array(binaryData)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            
            return "data:image/jpeg;base64," + base64String;
        }
    }

    React.useMemo(() => getWebLogo().then(logo=>setWebLogo(logo)), [isContextLoaded]);

    if (!isContextLoaded) {
        return <Spinner />
    }

    return <div>
        <div>
            {spContext?.webTitle}
        </div>
        <div>
            {spContext?.webDescription}
        </div>
        <div>
            <Image src={webLogo} />
        </div>
    </div>
}

