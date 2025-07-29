
import React, { useEffect, useState } from 'react';
import { Switch } from "antd";
import { storageKeys } from '../../utils/const';


const SwitchSkipBookmarkearthExternalLink: React.FC = () => {
    const [skip, setSkip] = useState(false)

    useEffect(() => {
        chrome.storage.local.get([storageKeys.autoSkipBookmarkearthExternalLinkVerification], (result) => {
            const dbVal = result[storageKeys.autoSkipBookmarkearthExternalLinkVerification];
            const autoSkip = dbVal != true ? false : true;
            setSkip(autoSkip)
        });
    }, [])

    const onChange = (checked: boolean) => {
        chrome.storage.local.set({
            [storageKeys.autoSkipBookmarkearthExternalLinkVerification]: checked
        }, () => {
            setSkip(checked)
        })
    };

    return (
        <Switch value={skip} onChange={onChange}></Switch>
    );
}

export default SwitchSkipBookmarkearthExternalLink;