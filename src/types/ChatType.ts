import {ChatTypeEnum} from "../enums/ChatType.enum";

export type ChatType = ChatTypeEnum.TEXT | ChatTypeEnum.AUDIO | ChatTypeEnum.VIDEO | ChatTypeEnum.IMAGE;
