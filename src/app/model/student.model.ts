export interface Student {
    id: number;
    fname: string;
    mname: string;
    lname: string;
    email: string;
    phone: string;
    doj: string;
    dob: string;
    grade: number;
}

export interface StudentTable {
    content: Student[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}
