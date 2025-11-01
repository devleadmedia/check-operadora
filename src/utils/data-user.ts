interface IDataUserFromLocalStorage {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

const getDataUserFromLocalStorage = localStorage.getItem(
  "@check_operadora:user"
);

const formatDataUserToJson: IDataUserFromLocalStorage | null =
  getDataUserFromLocalStorage ? JSON.parse(getDataUserFromLocalStorage) : null;

export const role = formatDataUserToJson?.role ?? "";
