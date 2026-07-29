import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBook } from "../hooks/useCreateBook";
import { useUpdateBook } from "../hooks/useUpdateBook";
import { Rb_Button, Rb_Input, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useCategories } from "../hooks/useCategories";
import { redirectToMyBooks } from "../utils/navigation";
import { showToast } from "../utils/toast";
import { BiChevronDown } from "react-icons/bi";

type BookFormValues = {
    name: string;
    author: string;
    edition: string;
    language: string;
    categoryId: string;
    description: string;
    rentalPricePerDay: string;
    rentalPricePerWeek: string;
    rentalPricePerMonth: string;
    securityDeposit: string;
    quantity: string;
    numberOfPages: string;
    publicationDate: string;
    condition: string;
    availabilityStatus: string;
};

type Category = {
    _id: string;
    name: string;
};

const defaultValues: BookFormValues = {
    name: "",
    author: "",
    edition: "",
    language: "",
    categoryId: "",
    description: "",
    rentalPricePerDay: "",
    rentalPricePerWeek: "",
    rentalPricePerMonth: "",
    securityDeposit: "",
    quantity: "",
    numberOfPages: "",
    publicationDate: "",
    condition: "",
    availabilityStatus: "available",
};

const inputClass =
    "box-border h-11 w-full rounded-lg border border-gray-300 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 " +
    "transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";
const selectClass = `${inputClass} mt-[10px] mb-[10px] appearance-none bg-white pr-9`;
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const sectionClass = "border-b border-gray-100 pb-8 last:border-b-0 last:pb-0";
const sectionHeadingClass = "mb-5 text-base font-semibold text-gray-900";

const FieldError = ({ message }: { message?: string }) =>
    message ? <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p> : null;

const RequiredMark = () => <span className="text-red-400"> *</span>;

type BookFormProps = {
    mode?: "create" | "edit";
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    initialData?: any;
    bookId?: string;
};

const BookForm = ({
    mode = "create",
    initialData,
    bookId,
}: BookFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BookFormValues>({ defaultValues, mode: "onSubmit" });

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [existingCoverImage, setExistingCoverImage] = useState("");
    const [existingImages, setExistingImages] =
        useState<
            {
                _id?: string;
                url: string;
                altText: string;
            }[]
        >([]);
    const [images, setImages] = useState<File[]>([]);
    const handleRemoveExistingImage = (
        index: number
    ) => {
        setExistingImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };
    const handleRemoveCoverImage = () => setCoverImage(null);
    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const getUser = () => {
        const value = localStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    };

    const user = getUser();
    const { mutate, isPending } = useCreateBook();
    const {
        mutate: updateBook,
        isPending: isUpdating,
    } = useUpdateBook();
    const { data: categoryData } = useCategories();
    const categories = categoryData?.data ?? [];

    useEffect(() => {
        if (mode !== "edit" || !initialData) return;

        reset({
            name: initialData.name,
            author: initialData.author,
            edition: initialData.edition,
            language: initialData.language,
            categoryId: initialData.categoryId,
            description: initialData.description,
            rentalPricePerDay: String(
                initialData.rentalPricePerDay
            ),
            rentalPricePerWeek: String(
                initialData.rentalPricePerWeek
            ),
            rentalPricePerMonth: String(
                initialData.rentalPricePerMonth
            ),
            securityDeposit: String(
                initialData.securityDeposit
            ),
            quantity: String(initialData.quantity),
            numberOfPages: String(
                initialData.numberOfPages
            ),
            publicationDate: initialData.publicationDate
                ? initialData.publicationDate.split("T")[0]
                : "",
            condition: initialData.condition,
            availabilityStatus:
                initialData.availabilityStatus,
        });

        setExistingCoverImage(
            initialData.coverImage ?? ""
        );

        setExistingImages(
            initialData.images ?? []
        );
    }, [initialData, mode, reset, categories]);

    const onSubmit = (form: BookFormValues) => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("categoryId", form.categoryId);
        formData.append("language", form.language);
        formData.append("author", form.author);
        formData.append("edition", form.edition);

        formData.append(
            "rentalPricePerDay",
            String(form.rentalPricePerDay)
        );

        formData.append(
            "rentalPricePerWeek",
            String(form.rentalPricePerWeek)
        );

        formData.append(
            "rentalPricePerMonth",
            String(form.rentalPricePerMonth)
        );

        formData.append(
            "securityDeposit",
            String(form.securityDeposit)
        );

        formData.append(
            "quantity",
            String(form.quantity)
        );

        formData.append(
            "numberOfPages",
            String(form.numberOfPages)
        );

        formData.append(
            "publicationDate",
            form.publicationDate
        );

        formData.append("condition", form.condition);

        formData.append(
            "sellerId",
            user._id
        );

        formData.append(
            "availableForSale",
            "false"
        );

        formData.append(
            "availableForRent",
            "true"
        );

        formData.append(
            "availabilityStatus",
            "available"
        );

        formData.append(
            "listingType",
            "rent"
        );

        formData.append(
            "purchasePrice",
            "0"
        );

        formData.append(
            "isPopular",
            "false"
        );

        if (coverImage) {
            formData.append(
                "coverImage",
                coverImage
            );
        }
        formData.append(
            "existingImages",
            JSON.stringify(existingImages)
        );
        images.forEach((image) => {
            formData.append(
                "images",
                image
            );
        });

        if (mode === "edit") {
            updateBook(
                {
                    bookId: bookId!,
                    formData,
                },
                {
                    onSuccess: () => {
                        showToast(
                            "Book updated successfully",
                            "success"
                        );
                        redirectToMyBooks();
                    },
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    onError: (error: any) => {
                        showToast(
                            error?.message ||
                            "Failed to update book",
                            "error"
                        );
                    },
                }
            );
        } else {
            mutate(formData, {
                onSuccess: () => {
                    showToast(
                        "Book created successfully",
                        "success"
                    );
                    redirectToMyBooks();
                },
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    showToast(
                        error?.message ||
                        "Failed to create book",
                        "error"
                    );
                },
            });
        }
    };

    return (
        <form
            className="mx-auto mt-3 w-full max-w-7xl space-y-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-10"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div>
                <Rb_Text variant="h2" className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {mode === "edit" ? "Edit Book" : "List a Book"}
                </Rb_Text>
                <p className="mt-1 text-sm text-gray-500">
                    {mode === "edit"
                        ? "Update the details below and save your changes."
                        : "Fill in the details below to list your book for rent."}
                </p>
            </div>

            <section className={sectionClass}>
                <Rb_Text variant="h2" className={sectionHeadingClass}>
                    Basic Information
                </Rb_Text>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>
                            Book Name
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            placeholder="Enter book name"
                            error={!!errors.name}
                            {...register("name", { required: "Book name is required" })}
                        />
                        <FieldError message={errors.name?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Category
                            <RequiredMark />
                        </label>
                        <div className="relative">
                            <select
                                {...register("categoryId", { required: "Please select a category" })}
                                className={selectClass}
                            >
                                <option value="">Select category</option>
                                {categories.map((category: Category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <BiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <FieldError message={errors.categoryId?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Author
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            placeholder="Enter author"
                            error={!!errors.author}
                            {...register("author", { required: "Author is required" })}
                        />
                        <FieldError message={errors.author?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Language
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            placeholder="Enter language"
                            error={!!errors.language}
                            {...register("language", { required: "Language is required" })}
                        />
                        <FieldError message={errors.language?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>Edition</label>
                        <Rb_Input
                            className={inputClass}
                            placeholder="Enter edition"
                            {...register("edition")}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Number of Pages
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            placeholder="Enter pages"
                            type="number"
                            error={!!errors.numberOfPages}
                            {...register("numberOfPages", {
                                required: "Number of pages is required",
                                min: { value: 1, message: "Must be at least 1 page" },
                            })}
                        />
                        <FieldError message={errors.numberOfPages?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>Publication Date</label>
                        <input
                            type="date"
                            {...register("publicationDate")}
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            <section className={sectionClass}>
                <Rb_Text variant="h2" className={sectionHeadingClass}>
                    Description
                </Rb_Text>
                <label className={labelClass}>
                    Book Description
                    <RequiredMark />
                </label>
                <textarea
                    rows={5}
                    {...register("description", { required: "Description is required" })}
                    className="w-full resize-none rounded-lg border border-gray-300 p-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Describe the book's condition, content, and anything a renter should know"
                />
                <FieldError message={errors.description?.message} />
            </section>

            <section className={sectionClass}>
                <Rb_Text variant="h2" className={sectionHeadingClass}>
                    Pricing
                </Rb_Text>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className={labelClass}>
                            Price / Day
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            type="number"
                            placeholder="0.00"
                            error={!!errors.rentalPricePerDay}
                            {...register("rentalPricePerDay", {
                                required: "Daily price is required",
                                min: { value: 0, message: "Must be 0 or more" },
                            })}
                        />
                        <FieldError message={errors.rentalPricePerDay?.message} />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Price / Week
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            type="number"
                            placeholder="0.00"
                            error={!!errors.rentalPricePerWeek}
                            {...register("rentalPricePerWeek", {
                                required: "Weekly price is required",
                                min: { value: 0, message: "Must be 0 or more" },
                            })}
                        />
                        <FieldError message={errors.rentalPricePerWeek?.message} />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Price / Month
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            type="number"
                            placeholder="0.00"
                            error={!!errors.rentalPricePerMonth}
                            {...register("rentalPricePerMonth", {
                                required: "Monthly price is required",
                                min: { value: 0, message: "Must be 0 or more" },
                            })}
                        />
                        <FieldError message={errors.rentalPricePerMonth?.message} />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Security Deposit
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            type="number"
                            placeholder="0.00"
                            error={!!errors.securityDeposit}
                            {...register("securityDeposit", {
                                required: "Security deposit is required",
                                min: { value: 0, message: "Must be 0 or more" },
                            })}
                        />
                        <FieldError message={errors.securityDeposit?.message} />
                    </div>
                </div>
            </section>

            <section className={sectionClass}>
                <Rb_Text variant="h2" className={sectionHeadingClass}>
                    Images
                </Rb_Text>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Cover Image */}
                    <div>
                        <label htmlFor="coverImage" className={labelClass}>
                            Cover Image
                        </label>

                        {coverImage || existingCoverImage ? (
                            <div className="group relative aspect-[3/4] w-28 sm:w-32 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <img
                                    src={coverImage ? URL.createObjectURL(coverImage) : existingCoverImage}
                                    alt="Cover"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveCoverImage}
                                    className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                                >
                                    <span className="text-[10px] leading-none">✕</span>
                                </button>
                                <label
                                    htmlFor="coverImage"
                                    className="absolute inset-x-0 bottom-0 cursor-pointer bg-black/50 py-1 text-center text-[11px] text-white opacity-0 transition group-hover:opacity-100"
                                >
                                    Replace
                                </label>
                            </div>
                        ) : (
                            <label
                                htmlFor="coverImage"
                                className="flex aspect-[3/4] w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-2 text-center transition hover:border-blue-400 hover:bg-blue-50"
                            >
                                <span className="text-xs font-medium text-gray-600">Click to upload</span>
                                <span className="text-[10px] text-gray-400">JPG, JPEG or PNG</span>
                            </label>
                        )}

                        <input
                            id="coverImage"
                            type="file"
                            accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                        />
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label htmlFor="bookImages" className={labelClass}>
                            Additional Images
                        </label>

                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                            {existingImages.map((img, index) => (
                                <div
                                    key={img._id ?? `${img.url}-${index}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.altText || "Book image"}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(index)}
                                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                                    >
                                        <span className="text-[10px] leading-none">✕</span>
                                    </button>
                                </div>
                            ))}

                            {images.map((img, index) => (
                                <div
                                    key={`${img.name}-${index}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-blue-200 shadow-sm"
                                >
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={img.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute bottom-1 left-1 rounded bg-blue-500 px-1 text-[9px] font-medium text-white">
                                        New
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                                    >
                                        <span className="text-[10px] leading-none">✕</span>
                                    </button>
                                </div>
                            ))}

                            {/* Upload tile lives inside the grid, same size as thumbnails */}
                            <label
                                htmlFor="bookImages"
                                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-1 text-center transition hover:border-blue-400 hover:bg-blue-50"
                            >
                                <span className="text-lg leading-none text-gray-400">+</span>
                                <span className="text-[9px] text-gray-500">Add images</span>
                            </label>
                        </div>

                        <input
                            id="bookImages"
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                setImages((prev) => [...prev, ...files]);
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className={sectionClass}>
                <Rb_Text variant="h2" className={sectionHeadingClass}>
                    Availability
                </Rb_Text>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>
                            Quantity
                            <RequiredMark />
                        </label>
                        <Rb_Input
                            className={inputClass}
                            type="number"
                            placeholder="Enter quantity"
                            error={!!errors.quantity}
                            {...register("quantity", {
                                required: "Quantity is required",
                                min: { value: 1, message: "Must be at least 1" },
                            })}
                        />
                        <FieldError message={errors.quantity?.message} />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Condition
                            <RequiredMark />
                        </label>
                        <div className="relative">
                            <select
                                {...register("condition", { required: "Please select a condition" })}
                                className={selectClass}
                            >
                                <option value="">Select condition</option>
                                <option value="new">New</option>
                                <option value="used">Used</option>
                                <option value="like new">Like New</option>
                                <option value="refurbished">Refurbished</option>
                            </select>
                            <BiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <FieldError message={errors.condition?.message} />
                    </div>
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Rb_Button
                    variant="secondary"
                    type="button"
                    disabled={isPending || isUpdating}
                    onClick={redirectToMyBooks}
                    className="h-11 w-full rounded-lg px-6 sm:w-auto"
                >
                    Cancel
                </Rb_Button>

                <Rb_Button
                    type="submit"
                    disabled={isPending || isUpdating}
                    className="h-11 w-full rounded-lg px-6 sm:w-auto"
                >
                    {isPending || isUpdating
                        ? "Saving..."
                        : mode === "edit"
                            ? "Update Book"
                            : "Save Book"}
                </Rb_Button>
            </div>
        </form>
    );
};

export default BookForm;