"use client";
import Image from "next/image";
import { Alert } from "flowbite-react";
import { useForm } from "@mantine/form";
import { TfiAlert } from "react-icons/tfi";
import { FiCheckCircle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";

import { City } from "@/config/types";
import { useAlert } from "@/hooks/alertContext";
import Input from "@/components/InputComponent";
import Button from "@/components/ButtonComponent";
import { getCities } from "@/services/ShippingService";
import LoaderComponent from "@/components/LoaderComponent";
import { linkAccount, unlinkAccount } from "@/services/AuthService";
import { getUser, updatePassword, updateUser } from "@/services/AuthService";
import { addNewReceiver, removeReceiver } from "@/services/SubscribeService";

import BuketIcon from "@/images/cart-component/delete.svg";
import GoogleIcon from "@/images/vectors/google-color.svg";
import FacebookIcon from "@/images/vectors/facebook-color.svg";

const MyAccountSection = () => {
  const months = [
    { value: "january", label: "Січень" },
    { value: "february", label: "Лютий" },
    { value: "march", label: "Березень" },
    { value: "april", label: "Квітень" },
    { value: "may", label: "Травень" },
    { value: "june", label: "Червень" },
    { value: "july", label: "Липень" },
    { value: "august", label: "Серпень" },
    { value: "september", label: "Вересень" },
    { value: "october", label: "Жовтень" },
    { value: "november", label: "Листопад" },
    { value: "december", label: "Грудень" },
  ];

  const getDaysInMonth = (
    month: string
  ): { value: string; label: string }[] => {
    const daysInMonthMap: { [key: string]: number } = {
      january: 31,
      february: 29,
      march: 31,
      april: 30,
      may: 31,
      june: 30,
      july: 31,
      august: 31,
      september: 30,
      october: 31,
      november: 30,
      december: 31,
    };

    const daysInMonth = daysInMonthMap[month] || 31;

    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1).padStart(2, "0"),
      value: String(i + 1),
    }));
  };

  const validOperators = [
    "067",
    "068",
    "096",
    "097",
    "098",
    "099",
    "063",
    "073",
    "093",
    "050",
    "066",
    "095",
    "091",
    "092",
    "094",
    "089",
    "093",
  ];

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const dayOptions = getDaysInMonth(month);
  const [isStart, setIsStart] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [infoMessage, setMessage] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setInfoMessage } = useAlert();
  const [googleAccount, setGoogleAccount] = useState("");
  // const [facebookAccount, setFacebookAccount] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setVisiblePassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setVisibleConfirmPassword((prev) => !prev);

  const form = useForm({
    initialValues: {
      name: "",
      fullname: "",
      email: "",
      phone: "",
      month: "",
      date: "",
      address1: "",
      address2: "",
      subscribe: false,
    },
    validate: {
      name: (value: string) =>
        value.length < 3 ? "Ім'я повинно містити не менше 3 символів" : null,
      fullname: (value: string) =>
        value.length < 3
          ? "Повне ім'я повинно містити не менше 3 символів"
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Невірна електронна адреса",
      phone: (value) => {
        if (value) {
          const operatorCode = form.values.phone.slice(3, 6);
          if (
            !/^\+38\d{10}$/.test(value) ||
            !validOperators.includes(operatorCode)
          ) {
            return "Некоректний номер телефону";
          }
          return null;
        }
      },
      date: (value, values) => {
        if (value) {
          const month = values.month;
          const maxDays = getDaysInMonth(month).length;
          const dayNumber = Number(value);

          if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > maxDays) {
            return "Оберіть коректну дату";
          }
          return null;
        }
      },
      address1: (value) => {
        if (!value.trim()) {
          return "Оберіть місто зі списку";
        }
        const cityExists = cities.some(({ Present }) => Present === value);
        if (!cityExists) {
          return "Оберіть правильне місто зі списку";
        }
        return null;
      },
      month: (value) => {
        const monthValues = months.map((month) => month.value);
        if (!monthValues.includes(value)) {
          return "Оберіть місяць зі списку";
        }
        return null;
      },
    },
  });

  const formWithPass = useForm({
    initialValues: {
      password: "",
      verify: "",
      remember: false,
    },
    validate: {
      password: (value) => {
        if (/\s/.test(value)) return "Пароль не може містити пробілів";
        if (/[\u0400-\u04FF]/.test(value))
          return "Не дозволяються кириличні символи";
        if (value.length < 6) return "Мінімум 6 символів";
        if (value.length > 20) return "Максимум 20 символів";
        if (!/[a-z]/.test(value)) {
          return "Пароль повинен містити хоча б одну маленьку літеру";
        }
        if (!/[A-Z]/.test(value)) {
          return "Пароль повинен містити хоча б одну велику літеру";
        }
        if (!/\d/.test(value)) {
          return "Пароль повинен містити хоча б одну цифру";
        }
        return null;
      },
      verify: (value, values) =>
        value !== values.password ? "Паролі не співпадають" : null,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user, subscribe } = await getUser();
        setUserName(`${user.firstName} ${user.lastName}` || "");
        const userMonth = user.dateOfBirth?.split(",")[0] || "";
        const userDay = user.dateOfBirth?.split(",")[1]?.trim() || "";
        const userAddress1 = user.address?.split("&")[0]?.trim() || "";
        setUserEmail(user.email);
        setGoogleAccount(user.google || "");
        // setFacebookAccount(user.facebook || "");
        form.setValues({
          name: user.firstName || "",
          fullname: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          month: userMonth,
          date: userDay,
          address1: userAddress1,
          address2: user.address?.split("&")[1]?.trim() || "",
        });
        if (userMonth && userDay) {
          setMonth(userMonth);
          setDay(userDay);
        }
        setSubscribe(subscribe);
        setLoading(false);
        setIsStart(true);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (form.values.phone && !form.values.phone.startsWith("+38")) {
      form.setFieldValue("phone", `+38${form.values.phone}`);
    }
    if (form.values.phone.length === 2) {
      form.setFieldValue("phone", "");
    }
  }, [form.values.phone]);

  const handleLinkAccount = async (type: "google" | "facebook", token: any) => {
    setLoading(true);
    const response = await linkAccount(type, token, userEmail);
    if (response === 200) {
      const { user } = await getUser();
      setGoogleAccount(user.google || "");
      setMessage({
        type: "success",
        text: "Обліковий запис успішно під'єднано",
      });
      setLoading(false);
    } else if (response === "A user with this google account already linked") {
      setMessage({
        type: "error",
        text: "Цей Google-акаунт уже використовується",
      });
      setLoading(false);
    } else {
      setMessage({
        type: "error",
        text: "Не вдалося під'єднати обліковий запис",
      });
      setLoading(false);
    }
  };

  const handleGoogleLink = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      await handleLinkAccount("google", tokenResponse);
    },
    onError: () =>
      setMessage({
        type: "error",
        text: "Помилка сервера google",
      }),
  });

  const handleUnlinkAccount = async (type: "google" | "facebook") => {
    setLoading(true);
    const response = await unlinkAccount(type, userEmail);

    if (response === 200) {
      setGoogleAccount("");
      setMessage({
        type: "success",
        text: "Обліковий запис успішно від'єднано",
      });
      setLoading(false);
    } else if (response === "Can not unlink without password") {
      setMessage({
        type: "error",
        text: "Спершу встановіть пароль",
      });
      setLoading(false);
    } else {
      setMessage({
        type: "error",
        text: "Не вдалося від'єднати обліковий запис",
      });
      setLoading(false);
    }
  };

  const handleUpdate = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const isProfileUpdated = form.isDirty();
    const isPasswordUpdated = formWithPass.isDirty();

    if (!isProfileUpdated && !isPasswordUpdated) {
      setLoading(false);
      return;
    }

    if (isProfileUpdated) {
      const errors = form.validate();
      if (Object.keys(errors.errors).length > 0) {
        setLoading(false);
        return;
      }

      const values = form.values;
      const response = await updateUser({
        lastname: values.fullname,
        firstname: values.name,
        email: values.email,
        phoneNumber: values.phone,
        dateOfBirth: `${values.month},${values.date}`,
        address: `${values.address1}&${values.address2}`,
      });

      if (response === 201) {
        if (subscribe !== values.subscribe) {
          let response1;
          if (values.subscribe) {
            response1 = await addNewReceiver(
              values.name,
              values.email,
              setInfoMessage
            );
            if (response1 === 201) {
              setSubscribe(true);
              form.setFieldValue("subscribe", true);
            }
          } else {
            response1 = await removeReceiver(values.email, setInfoMessage);
            if (response1 === 204) {
              setSubscribe(false);
              form.setFieldValue("subscribe", false);
            }
          }
        }
        setMessage({ type: "success", text: "Ваші дані успішно оновлені!" });
      }
    }

    if (isPasswordUpdated) {
      const errors = formWithPass.validate();
      if (Object.keys(errors.errors).length > 0) {
        setLoading(false);
        return;
      }

      const values = formWithPass.values;
      const response = await updatePassword(values.password);

      if (response.status === 201) {
        setMessage({ type: "success", text: "Ваш пароль успішно оновлений!" });
        formWithPass.reset();
      }
    }

    setLoading(false);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleSelect = async (value: string) => {
    if (!value.trim()) {
      setCities([]);
      return;
    }

    const selectedCity = cities.find(({ Ref }) => Ref === value);
    if (selectedCity) {
      form.setFieldValue("address1", selectedCity.Present);
      setCities([]);
    } else {
      const city = await getCities(value, setInfoMessage);
      if (city.length === 0) {
        setError(null);
      } else {
        setError(null);
        setCities(city);
      }
    }
  };

  return (
    <>
      {infoMessage && (
        <Alert
          color={infoMessage.type === "success" ? "green" : "red"}
          className={`fixed bottom-0 right-0 m-4 p-4 z-10 text-[16px] lg:text-[18px] ${
            infoMessage.type === "success" ? "text-[green]" : "text-[red]"
          }`}
        >
          <div className="flex items-center space-x-2">
            {infoMessage.type === "success" ? <FiCheckCircle /> : <TfiAlert />}
            <span>{infoMessage.text}</span>
          </div>
        </Alert>
      )}
      {loading && <LoaderComponent />}

      <>
        <div className="flex flex-col items-center gap-[10px] md:gap-[15px] mb-[44px]">
          <h1 className="text-black text-[36px] md:text-[52px] font-medium">
            Привіт, {userName}
          </h1>
          <p className="text-[14px] text-silver md:text-[16px] text-center">
            Ласкаво просимо до вашої панелі управління — універсального центру
            для всіх ваших останніх дій у обліковому записі
          </p>
        </div>
        <form
          onSubmit={handleUpdate}
          className="flex flex-col items-center gap-[46px] mt-[46px]  lg:items-end"
        >
          <div className="flex flex-col items-center gap-[46px] lg:items-end">
            <div className="w-full bg-snow border border-whisper border-solid rounded-lg flex flex-col py-[30px] px-[37px] ">
              <h2 className="mb-[20px] text-[24px] text-silver">
                Моя інформація
              </h2>
              <div className="flex flex-wrap justify-center text-center gap-y-[20px] lg:gap-y-[36px] gap-x-[50px]">
                <Input
                  inputType="input"
                  className="w-full lg:w-[45%]"
                  placeholder="Ім'я"
                  type="text"
                  error={true}
                  errorType="critical"
                  bordered
                  fullWidth
                  {...form.getInputProps("name")}
                />

                <Input
                  inputType="input"
                  className="w-full  lg:w-[45%] "
                  placeholder="Прізвище"
                  type="text"
                  error={true}
                  errorType="critical"
                  bordered
                  fullWidth
                  {...form.getInputProps("fullname")}
                />

                <Input
                  inputType="input"
                  className="w-full lg:w-[45%]"
                  placeholder="Електрона пошта"
                  type="email"
                  fullWidth
                  error={true}
                  errorType="critical"
                  bordered
                  {...form.getInputProps("email")}
                />

                <Input
                  inputType="input"
                  placeholder="Номер телефону"
                  type="text"
                  className="w-full lg:w-[45%]"
                  bordered
                  errorType="critical"
                  fullWidth
                  {...form.getInputProps("phone")}
                />

                <Input
                  placeholder="Місяць"
                  inputType="select"
                  value={month}
                  scrollable={true}
                  onSelect={(value) => {
                    setMonth(value);
                    form.setFieldValue("month", value);
                  }}
                  options={months}
                  bordered={true}
                  errorType="critical"
                  className="mini:w-full lg:w-[45%]"
                  {...form.getInputProps("month")}
                />

                <Input
                  placeholder="День"
                  inputType="select"
                  bordered={true}
                  value={day}
                  options={dayOptions}
                  scrollable={true}
                  errorType="critical"
                  onSelect={(value) => {
                    setDay(value);
                    form.setFieldValue("date", value);
                  }}
                  className="mini:w-full lg:w-[45%]"
                  {...form.getInputProps("date")}
                />
              </div>
            </div>

            <div className="w-full bg-snow border border-whisper border-solid rounded-lg flex flex-col py-[30px] px-[37px]">
              <h2 className="mb-[20px] text-[24px] text-silver">Моя адреса</h2>

              <div className="flex flex-wrap justify-center text-center gap-y-[20px] lg:gap-y-[36px] gap-x-[50px]">
                {isStart && (
                  <div className="flex flex-col w-full lg:w-[45%]">
                    <Input
                      className="mini:w-full"
                      inputType="select"
                      error={true}
                      bordered
                      placeholder="Оберіть населений пункт"
                      options={cities.map((city) => ({
                        value: city.Ref,
                        label: city.Present,
                      }))}
                      {...form.getInputProps("address1")}
                      onSelect={handleSelect}
                      errorType="critical"
                      scrollable
                    />
                    {error && (
                      <p className="text-darkBlack text-[14px]">{error}</p>
                    )}
                  </div>
                )}
                <Input
                  inputType="input"
                  className="w-full  lg:w-[45%] "
                  name="address2"
                  placeholder="Вулиця, будинок/квартира"
                  type="text"
                  bordered
                  fullWidth
                  
                  {...form.getInputProps("address2")}
                />
              </div>
            </div>
            <div className="w-full bg-snow border border-whisper border-solid rounded-lg flex flex-col py-[30px] px-[37px] ">
              <h2 className="mb-[20px] text-[28px] text-silver">
                Новий пароль
              </h2>
              <div className="flex flex-wrap justify-center gap-y-[20px] lg:gap-y-[36px] gap-x-[50px]">
                <Input
                  inputType="password"
                  type="password"
                  name="password"
                  visible={visiblePassword}
                  onVisibilityChange={togglePasswordVisibility}
                  placeholder="Ваш пароль"
                  bordered
                  error={true}
                  errorType="critical"
                  fullWidth
                  className="w-full lg:w-[45%]"
                  {...formWithPass.getInputProps("password")}
                />

                <Input
                  inputType="password"
                  visible={visibleConfirmPassword}
                  onVisibilityChange={toggleConfirmPasswordVisibility}
                  type="password"
                  name="Confirm password"
                  placeholder="Підтвердіть пароль"
                  bordered
                  error={true}
                  errorType="critical"
                  fullWidth
                  className="w-full lg:w-[45%]"
                  {...formWithPass.getInputProps("verify")}
                />
              </div>
            </div>
            <div className="w-full flex text-[16px] items-center flex-col lg:flex-row text-silver justify-between gap-[14px] mt-[-20px] text-left">
              <div className="flex items-center">
                <input
                  {...form.getInputProps("subscribe")}
                  type="checkbox"
                  id="sign-up-update"
                  className="w-[20px] h-[20px] appearance-none border-2 border-gray-400 rounded-sm checked:bg-darkBlack checked:border-darkBlack checked:after:content-['✔'] checked:after:flex checked:after:justify-center checked:after:items-center checked:after:w-full checked:after:h-full checked:after:text-white focus:outline-none focus:ring-0"
                />
                <label htmlFor="sign-up-update" className="ml-2 text-gray-700">
                  Отримувати найсвіжіші оновлення та акції
                </label>
              </div>
            </div>
          </div>
          <Button text="Оновити" className="mt-[-20px]" type="submit" />
        </form>

        <div className="w-full bg-snow border border-whisper border-solid rounded-lg flex flex-col mt-[46px] py-[30px] px-[37px]">
          <h2 className="mb-[20px] text-[24px] text-silver">
            Прив'язані аккаунти
          </h2>
          <div className="flex flex-wrap justify-center gap-y-[20px] lg:gap-y-[36px] gap-x-[50px]">
            <div className="w-full flex items-center justify-between border border-solid border-gray-300 py-[16px] px-[30px] rounded-[5px] lg:mx-[19px] xl:mx-[40px]">
              <div className="flex items-center gap-3 w-full">
                <Image
                  src={GoogleIcon}
                  alt="Google icon"
                  width={22}
                  height={22}
                />

                {googleAccount ? (
                  <input
                    type="text"
                    value={googleAccount}
                    readOnly
                    className="bg-transparent border-none w-full text-[15px] text-gray-700 truncate focus:outline-none"
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:text-darkBlack text-[15px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap block"
                    onClick={() => handleGoogleLink()}
                  >
                    Підв'язати
                  </span>
                )}
              </div>

              {googleAccount && (
                <Image
                  src={BuketIcon}
                  alt="Unlink"
                  width={20}
                  height={20}
                  className="object-contain h-5 w-5 hover:scale-110 duration-300 cursor-pointer"
                  onClick={() => handleUnlinkAccount("google")}
                />
              )}
            </div>

            {/* <div className="w-full flex items-center justify-between border border-solid border-gray-300 py-[16px] px-[30px] rounded-[5px] lg:mx-[19px] xl:mx-[40px]">
              <Image
                src={FacebookIcon}
                alt="Facebook icon"
                width={22}
                height={22}
              />
              {facebookAccount ? (
                <div className="flex items-center gap-4">
                  <p>{facebookAccount}</p>
                  <Image
                    src={BuketIcon}
                    alt="Unlink"
                    width={20}
                    height={20}
                    className="object-fit h-5 w-5 hover:scale-110 duration-300"
                    onClick={() => handleUnlinkAccount("facebook")}
                  />
                </div>
              ) : (
                <span
                  className="cursor-pointer hover:text-darkBlack"
                  onClick={() => handleLinkAccount("facebook")}
                >
                  Підв'язати
                </span>
              )}
            </div> */}
          </div>
        </div>
      </>
    </>
  );
};

export default MyAccountSection;
