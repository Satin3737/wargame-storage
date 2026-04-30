export const Category = {
    boardGames: 'board-games',
    tinFigures: 'tin-figures',
    miniatures: 'miniatures',
    modeling: 'modeling',
    accessories: 'accessories'
} as const;

export type ICategory = (typeof Category)[keyof typeof Category];

export const CategoryValues: ICategory[] = [
    Category.boardGames,
    Category.tinFigures,
    Category.miniatures,
    Category.modeling,
    Category.accessories
];

export const CategoryLabel: Record<ICategory, string> = {
    [Category.boardGames]: 'Настольные игры',
    [Category.tinFigures]: 'Оловянные фигурки',
    [Category.miniatures]: 'Миниатюры',
    [Category.modeling]: 'Моделирование',
    [Category.accessories]: 'Аксессуары'
};
