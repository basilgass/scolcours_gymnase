import {User} from "@/types/index";

export interface ChapterInterface {
    id: number,
    slug: string,
    title: string,
    block: BlockInterface,
    active: boolean,
    updated_at: string,
    posts: PostInterface[],
    challenges: {
        id: number,
        slug: string,
        title: string
    }[],
    relations: {
        id: number,
        slug: string,
        title: string,
        theme_id: number
    }[]
}

export interface BlockInterface {
    id: number,
    order: number,
    blur: boolean,
    switch: string,
    type: string,
    title: string,
    body: string,
    template: string,
    illustrations: IllustrationInterface[],
    script: string,
    json: string,
}

export interface IllustrationInterface {
    id: number,
    block_id: number,
    order: number,
    title: string,
    css: string,
    value: string,
    type: string,
    code: string,
    parameters: string
}

export interface QuestionInterface {
    id: number,
    order: number,
    displayIf: boolean,
    css: string,
    body: string,
    block: {
        id: number,
        title: string,
        body: string,
        illustration: IllustrationInterface
    },
    answer: string,
    checker: string,
    keyboard: string,
    user: {
        answer: string,
        result: boolean,
        attempts: number,
        update_at: string
    }[]
}

export interface PostInterface {
    id: number,
    chapter_id: number,
    type: string,
    title: string,
    order: number,
    numberOfVisibleBlocks: number,
    active: number,
    script: string,
    switch: string,
    blocks: BlockInterface[],
    questions: QuestionInterface[],
    questionGrid: string,
}


export interface EvaluationInterface {
    id: number,
    slug: string,
    title: string,
    body: string,
    randomOrder: boolean,
    owner: User,
    questions: QuestionInterface[]
}
