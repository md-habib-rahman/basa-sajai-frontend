import Swal from "sweetalert2";

export const confirmDelete = async (title = "Delete item?") => {
  const result = await Swal.fire({
    title,

    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // Tailwind rose-600
    cancelButtonColor: "#64748b", // Tailwind slate-500
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-2xl font-sans",
      confirmButton: "px-4 py-2 text-xs font-bold rounded-xl",
      cancelButton: "px-4 py-2 text-xs font-bold rounded-xl",
    },
  });

  return result.isConfirmed;
};
