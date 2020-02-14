import {ChangeEvent, Component} from "react";
import * as React from 'react'

import convert from "xml-js"
import _ from "lodash"
import moment from "moment"

import './FileSelectArea.css';

interface MetadataHashMap {
    [key: string]: string | number
}

interface FileSelectAreaState {
    metadata: MetadataHashMap
}

export class FileSelectArea extends Component<any, FileSelectAreaState> {
    private fileInput = React.createRef<HTMLInputElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            metadata: {}
        }
    }

    render() {
        return <div>
            <h2>DMARC Report File Select</h2>
            <input type="file" ref={this.fileInput} onChange={this.onFileSelect.bind(this)}/>
            {this.renderInfo()}
        </div>
    }

    private renderInfo(): JSX.Element | null {
        const {metadata} = this.state;

        if (Object.keys(this.state.metadata).length > 0) {
            return <div>
                <h2>DMARC Report Metadata</h2>
                <table>
                    {
                        Object.keys(metadata).map((key) => {
                            if (key === "date_start" || key === "date_end") {
                                return <tr key={key}>
                                    <td>{key}</td>
                                    <td>{moment(metadata[key]).format("YYYY/MM/DD HH:mm:ss")} (Local time)</td>
                                </tr>
                            }
                            return <tr key={key}>
                                <td>{key}</td>
                                <td>{metadata[key]}</td>
                            </tr>
                        })
                    }
                </table>
            </div>
        }
        return null
    }

    private onFileSelect(event: ChangeEvent) {
        console.log(event)
        console.log(this.fileInput?.current?.files?.[0]);
        console.log(this.fileInput?.current?.files?.[0].name);

        let r = new FileReader();
        r.onload = () => {
            const data = r.result as string;
            const xmlData = convert.xml2js(data);
            console.log(xmlData);
            const metadataIndex = _.findKey(xmlData.elements[0].elements, {
                name: 'report_metadata'
            });
            const meta = xmlData.elements[0].elements[metadataIndex as string];
            const metadata: MetadataHashMap = {};
            meta.elements.forEach((metaKey: any) => {
                if (metaKey.name === "date_range") {
                    const start = metaKey.elements[0];
                    const end = metaKey.elements[1];
                    metadata['date_start'] = parseInt(start.elements[0].text, 10) * 1000;
                    metadata['date_end'] = parseInt(end.elements[0].text, 10) * 1000;
                    return;
                }
                metadata[metaKey.name] = metaKey.elements[0].text
            });
            this.setState({
                metadata: metadata
            })
        };
        r.readAsText(this.fileInput?.current?.files?.[0] as Blob)
    }
}