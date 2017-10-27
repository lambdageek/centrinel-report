import * as React from 'react';

export interface CentrinelMessage {
    tag: 'Normal' | 'Verbose' | 'Abnormal';
    contents?: string | [boolean, string];
}

export class CentrinelMessageView extends React.Component<{ message: CentrinelMessage}, {}> {
    render() {
        const m = this.props.message;
        if (m.contents === undefined) {
            return false;
        } else if (typeof m.contents === 'string') {
            return <code>{m.contents}</code>;
        } else {
            return <code>{m.contents[1]}</code>;
        }
    }
}

export function keyForMessage (msg: {} | CentrinelMessage, i: number): string {
    return i.toString();
}
