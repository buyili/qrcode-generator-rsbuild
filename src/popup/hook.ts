import { useEffect, useState } from "react";
import QRCode from 'qrcode';

export function useQrcodeUrl(text: string) {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(()=>{
        if(!text) {
            setUrl(null)
            return
        }
        QRCode.toDataURL(text)
            .then((url: string) => {
                console.log("🚀 ~ Popup ~ current tab to qrcode url:")
                setUrl(url)
            })
            .catch((err: any) => {
                console.error(err)
            })
    })

    return url
}