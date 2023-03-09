import { _decorator, Label } from 'cc';
import { ioc } from 'lite-ts-ioc';

import { LangServiceBase } from './lang-service-base';

const { ccclass } = _decorator;

@ccclass('CcAmountLabel')


export class CcAmountLabel extends Label {
    private m_Value: string[];
    public set value(v: string[]) {
        this.m_Value = v;
        this.bind();
    }

    public constructor(
        private m_LangService: LangServiceBase
    ) {
        super();
    }

    public async start() {
        await this.bind();
    }

    private async bind() {
        if (this.m_Value == null) {
            if (this.string)
                this.m_Value = this.string.split(',');
            else
                return;
        }

        if (!this.m_Value.length)
            return this.string = '';

        const tempArr: string[] = [];
        let langValueText: string;

        //格式化
        for (let index = 0, langKey: string; index < this.m_Value.length; index++) {
            let value = + this.m_Value[index];
            //为字符串特殊处理
            if (Number.isNaN(value) && index == this.m_Value.length - 1) {
                continue;
            } else if (Number.isNaN(value)) {
                tempArr.push(this.m_Value[index]);
                continue;
            }

            if (value < 100000000) {
                value = Math.floor(value / 10000 * 100) / 100;
                langKey = 'ten_thousand';//{0}万
            } else if (value < 1000000000000) {
                value = Math.floor(value / 100000000 * 100) / 100;
                langKey = 'billion';//{0}亿
            } else {
                value = Math.floor(value / 1000000000000 * 100) / 100;
                langKey = 'trillion';//{0}兆
            }
            const newValueText = langKey ? await ioc.get<LangServiceBase>(this.m_LangService).get(langKey, value.toString()) : value.toString();
            langValueText = newValueText;
            tempArr.push(newValueText);
        }

        if (Number.isNaN(+this.m_Value[this.m_Value.length - 1]))
            langValueText = await ioc.get<LangServiceBase>(this.m_LangService).get(this.m_Value[this.m_Value.length - 1], ...tempArr);
        this.string = langValueText;
    }
}
