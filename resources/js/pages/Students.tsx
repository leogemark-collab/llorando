import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import studentRoutes from '@/routes/students';
import type { BreadcrumbItem } from '@/types';

type Student = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    gender: 'male' | 'female';
    birthday: string;
    year_level: number | string;
    age: number | null;
};

type StudentForm = Omit<Student, 'id' | 'age'>;

type PaginatedStudents = {
    data: Student[];
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

const emptyStudent: StudentForm = {
    first_name: '',
    last_name: '',
    email: '',
    program: '',
    gender: 'male',
    birthday: '',
    year_level: 1,
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: studentRoutes.index() },
];

export default function Students({
    students,
}: {
    students: PaginatedStudents;
}) {
    const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
    const [studentBeingEdited, setStudentBeingEdited] =
        useState<Student | null>(null);
    const [studentBeingDeleted, setStudentBeingDeleted] =
        useState<Student | null>(null);
    const form = useForm<StudentForm>(emptyStudent);

    const openCreateDialog = (): void => {
        setStudentBeingEdited(null);
        form.clearErrors();
        form.setData(emptyStudent);
        setIsStudentDialogOpen(true);
    };

    const openEditDialog = (student: Student): void => {
        setStudentBeingEdited(student);
        form.clearErrors();
        form.setData({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            program: student.program,
            gender: student.gender,
            birthday: student.birthday.slice(0, 10),
            year_level: Number(student.year_level),
        });
        setIsStudentDialogOpen(true);
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const options = {
            onSuccess: (): void => {
                setIsStudentDialogOpen(false);
                setStudentBeingEdited(null);
                form.reset();
            },
        };

        if (studentBeingEdited) {
            form.put(studentRoutes.update(studentBeingEdited).url, options);

            return;
        }

        form.post(studentRoutes.store().url, options);
    };

    const deleteStudent = (): void => {
        if (!studentBeingDeleted) {
            return;
        }

        router.delete(studentRoutes.destroy(studentBeingDeleted).url, {
            onSuccess: () => setStudentBeingDeleted(null),
        });
    };

    return (
        <>
            <Head title="Students" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Students
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage student records in one place.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus />
                        Add student
                    </Button>
                </div>

                <Card className="gap-0 py-0">
                    <CardHeader className="border-b py-5">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="size-4" />
                            Student directory
                        </CardTitle>
                        <CardDescription>
                            {students.total}{' '}
                            {students.total === 1 ? 'student' : 'students'}
                            {' registered'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {students.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                                <Users className="size-8 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        No students yet
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Add the first student to get started.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={openCreateDialog}
                                >
                                    <Plus />
                                    Add student
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[760px] text-sm">
                                        <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">
                                                    Student
                                                </th>
                                                <th className="px-6 py-3 font-medium">
                                                    Program
                                                </th>
                                                <th className="px-6 py-3 font-medium">
                                                    Year
                                                </th>
                                                <th className="px-6 py-3 font-medium">
                                                    Age
                                                </th>
                                                <th className="px-6 py-3 font-medium">
                                                    Gender
                                                </th>
                                                <th className="w-28 px-6 py-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {students.data.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className="hover:bg-muted/40"
                                                >
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium">
                                                            {student.first_name}{' '}
                                                            {student.last_name}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {student.email}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary">
                                                            {student.program}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        Year{' '}
                                                        {student.year_level}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {student.age ?? '—'}
                                                    </td>
                                                    <td className="px-6 py-4 capitalize">
                                                        {student.gender}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label={`Edit ${student.first_name} ${student.last_name}`}
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        student,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                aria-label={`Remove ${student.first_name} ${student.last_name}`}
                                                                onClick={() =>
                                                                    setStudentBeingDeleted(
                                                                        student,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col gap-3 border-t px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-muted-foreground">
                                        Showing {students.from}–{students.to} of{' '}
                                        {students.total}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild={Boolean(
                                                students.prev_page_url,
                                            )}
                                            disabled={!students.prev_page_url}
                                        >
                                            {students.prev_page_url ? (
                                                <Link
                                                    href={
                                                        students.prev_page_url
                                                    }
                                                >
                                                    Previous
                                                </Link>
                                            ) : (
                                                <span>Previous</span>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild={Boolean(
                                                students.next_page_url,
                                            )}
                                            disabled={!students.next_page_url}
                                        >
                                            {students.next_page_url ? (
                                                <Link
                                                    href={
                                                        students.next_page_url
                                                    }
                                                >
                                                    Next
                                                </Link>
                                            ) : (
                                                <span>Next</span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <StudentDialog
                isOpen={isStudentDialogOpen}
                isEditing={Boolean(studentBeingEdited)}
                form={form}
                onOpenChange={setIsStudentDialogOpen}
                onSubmit={submit}
            />

            <DeleteStudentDialog
                student={studentBeingDeleted}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setStudentBeingDeleted(null);
                    }
                }}
                onConfirm={deleteStudent}
            />
        </>
    );
}

function StudentDialog({
    isOpen,
    isEditing,
    form,
    onOpenChange,
    onSubmit,
}: {
    isOpen: boolean;
    isEditing: boolean;
    form: ReturnType<typeof useForm<StudentForm>>;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit student' : 'Add student'}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the student’s academic and contact details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="First name"
                            error={form.errors.first_name}
                        >
                            <Input
                                value={form.data.first_name}
                                onChange={(event) =>
                                    form.setData(
                                        'first_name',
                                        event.target.value,
                                    )
                                }
                                aria-invalid={Boolean(form.errors.first_name)}
                            />
                        </Field>
                        <Field label="Last name" error={form.errors.last_name}>
                            <Input
                                value={form.data.last_name}
                                onChange={(event) =>
                                    form.setData(
                                        'last_name',
                                        event.target.value,
                                    )
                                }
                                aria-invalid={Boolean(form.errors.last_name)}
                            />
                        </Field>
                    </div>

                    <Field label="Email address" error={form.errors.email}>
                        <Input
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.email)}
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Program" error={form.errors.program}>
                            <Input
                                placeholder="e.g. BSIT"
                                value={form.data.program}
                                onChange={(event) =>
                                    form.setData('program', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.program)}
                            />
                        </Field>
                        <Field label="Birthday" error={form.errors.birthday}>
                            <Input
                                type="date"
                                value={form.data.birthday}
                                onChange={(event) =>
                                    form.setData('birthday', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.birthday)}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Gender" error={form.errors.gender}>
                            <Select
                                value={form.data.gender}
                                onValueChange={(value: StudentForm['gender']) =>
                                    form.setData('gender', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Year level"
                            error={form.errors.year_level}
                        >
                            <Select
                                value={String(form.data.year_level)}
                                onValueChange={(value) =>
                                    form.setData('year_level', Number(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4].map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={String(year)}
                                        >
                                            Year {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing
                                ? 'Saving…'
                                : isEditing
                                  ? 'Save changes'
                                  : 'Create student'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteStudentDialog({
    student,
    onOpenChange,
    onConfirm,
}: {
    student: Student | null;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove student?</DialogTitle>
                    <DialogDescription>
                        {student
                            ? `This will permanently remove ${student.first_name} ${student.last_name}.`
                            : 'This action cannot be undone.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Remove student
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

Students.layout = { breadcrumbs };
