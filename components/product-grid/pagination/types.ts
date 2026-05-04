export interface IPaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}
