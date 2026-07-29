export const validateBook = (
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    form: any
) => {
    if (!form.name.trim())
        return "Book name is required";

    if (!form.categoryId)
        return "Category is required";

    if (!form.author.trim())
        return "Author is required";

    if (!form.language.trim())
        return "Language is required";

    if (!form.description.trim())
        return "Description is required";

    if (!form.condition)
        return "Condition is required";

    if (
        Number(form.quantity) <= 0
    )
        return "Quantity should be greater than 0";

    if (
        Number(form.numberOfPages) <= 0
    )
        return "Number of pages should be greater than 0";

    if (
        Number(
            form.rentalPricePerDay
        ) <= 0
    )
        return "Rental price/day should be greater than 0";

    if (
        Number(
            form.rentalPricePerWeek
        ) <= 0
    )
        return "Rental price/week should be greater than 0";

    if (
        Number(
            form.rentalPricePerMonth
        ) <= 0
    )
        return "Rental price/month should be greater than 0";

    if (
        Number(
            form.securityDeposit
        ) < 0
    )
        return "Security deposit cannot be negative";

    return null;
};