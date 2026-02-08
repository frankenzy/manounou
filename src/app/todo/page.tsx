"use client";
import { useEffect, useReducer, useState } from "react";

import Header from "@/components/header";
import Badge from "@/components/Badge";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperclip,
  faFaceSmile,
  faChevronDown,
  faGripVertical,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import VerticalBar from "@/components/VerticalBar";
import { format } from "date-fns";

import "./style.css";

import HorizontalBar from "@/components/HorizontalBar";
import Input from "@/components/Input";
import tasksReducer from "@/hooks/useReducter";
import RootLayout from "../layout";

export default function About() {
  const [tasks, setTasks] = useState([
    {
      title: "Margherita Pizza",
      status: "complete",
      completed: false,
      attachments: [
        { name: "file1.jpg", type: "image" },
        { name: "file2.pdf", type: "document" },
        { name: "file3.docx", type: "document" },
      ],
    },
    {
      title: "Peanut Butter",
      content: "Content for Task 2",
      date: "2023-08-02",
      priority: "medium",
      status: "pending",
      completed: false,
      attachments: [
        { name: "file4.jpg", type: "image" },
        { name: "file5.pdf", type: "document" },
      ],
    },
  ]);


  const [countCompleted, setCountCompleted] = useState(0);
  const [title, setTitle] = useState("");
  const [Isloading, setIsLoading] = useState(false);
  const handleClick = () => {
    alert("option ....");
  };

  const [taskCount, setTaskCount] = useState(0);
  const [tasksState, dispatchTashs] = useReducer(tasksReducer, {
    tasks: [],
    isLoading: false,
    count: 0,
  });

  useEffect(() => {
    setTaskCount(tasks.length);
  }, [tasks]);

  const handleCompleted = (index: number) => {
    const updatedTodos = tasks.map((todo, idx) => {
      if (idx === index) {
        console.log(todo);
        const updatedTodo = { ...todo, completed: !todo.completed };
        console.log(todo);
        return updatedTodo;
      }
      return todo;
    });
    setTasks(updatedTodos);
  };

  const handleAddTask = () => {
    const data = {
      title: title,
      content: "",
      date: format(new Date(), "yyyy-MM-dd"),
      priority: "medium",
      status: "pending",
      completed: false,
      attachments: [
        { name: "file1.jpg", type: "image" },
        { name: "file2.pdf", type: "document" },
        { name: "file3.docx", type: "document" },
      ],
    };

    console.log(data);

    setTasks((prevTasks) => [...prevTasks, data]);

    setTitle("");
  };

  useEffect(() => {
    tasks.map(
      (task) => {
        if (task.completed) {
          setCountCompleted(countCompleted + 1);
        }
      },
      [tasks],
    );
    console.log("task count completed", countCompleted);
  }, [tasks]);

  // useEffect(() => {

  //   if (completed) {
  //   setTasks(tasks.filter((task) =>!task.completed));
  //   } else {
  //     setTasks(tasks);
  //   }
  // }, [tasks]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      <RootLayout>
        <Header />

        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col bg-white rounded-2xl p-8 min-h-4/5 sm:w-1/4 w-2/3">
            <div className="flex flex-col container">
              <div className="flex flex-row p-4 justify-between">
                <div className="flex flex-row justify-between gap-3 text-sm">
                  <div>
                    <a href="" title="About">
                      <FontAwesomeIcon icon={faArrowLeft} className="w-4" />
                    </a>
                  </div>

                  <div className="flex">Francis KONAN</div>

                  <Badge texte="+5" />
                </div>

                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <Image
                    src="/04.jpg"
                    alt="hero"
                    width={60}
                    height={40}
                    className="object-cover h-full w-full rounded-full"
                  />
                </div>
              </div>

              <div className="content flex flex-col p-4 ">
                <div className="flex flex-row justify-between gap-4">
                  <div className="flex flex-row w-full gap-2 items-center">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2 items-center">
                        <h3 className="text-xl font-bold">2:00</h3>
                        <span className="text-[10px] mb-4 text-slate-400">
                          PM
                        </span>
                      </div>
                      <p className="text-[10px]">Sat, Dec 11</p>
                    </div>

                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-slate-300 mb-4"
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2 items-center">
                        <h3 className="text-xl font-bold">5:00</h3>
                        <span className="text-[10px] mb-4 text-slate-400">
                          PM
                        </span>
                      </div>
                      <p className="text-[10px]">Sat, Dec 11</p>
                    </div>
                  </div>
                  <div>
                    <span className="flex items-center w-full text-slate-400">
                      ...
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="w-fu {Isloading ?? (
                <div className="flex flex-row justify-normal">
                <p className="text-slate-300 text-sm">loading ...</p>
            </div>
             )}l h-0.5 bg-gray-200"></div> */}
              <HorizontalBar />
              {Isloading ? (
                // <div className="loading-dots">
                //   <div className="dot"></div>
                //   <div className="dot"></div>
                //   <div className="dot"></div>
                // </div>
                <div>
                  loading
                  <span className="opacity-0 animate-fadeInOut text-slate-400 text-sm">
                    .
                  </span>
                  <span className="opacity-0 animate-fadeInOut animation-delay-500 text-slate-400 text-sm">
                    .
                  </span>
                  <span className="opacity-0 animate-fadeInOut animation-delay-1000 text-slate-400 text-sm">
                    .
                  </span>
                </div>
              ) : null}
              <div className="content flex flex-col py-4">
                <div className="flex flex-row justify-between py-2">
                  <div className="flex flex-row gap-2">
                    <p className="text-sm text-slate-400">
                      <span>{countCompleted}</span>
                      <span>/</span>
                      <span>{taskCount}</span>
                    </p>
                    <p className="text-sm">Liste des taches</p>
                  </div>
                  <div className="flex flex-row">
                    <label className="flex items-center cursor-pointer">
                      <Input
                        type="checkbox"
                        className="sr-only"
                      // checked={completed}
                      //onChange={handleCompleted}
                      />
                      <div
                        className={`w-6 h-3 rounded-full border-2 transition-colors duration-300 ${status
                          ? "bg-green-600 border-green-600"
                          : "bg-black border-black"
                          }`}
                      >
                        <div
                          className={`w-3 h-full rounded-full transition-transform duration-300 ${status ? "translate-x-2 bg-white" : "bg-white"
                            }`}
                        ></div>
                      </div>
                    </label>
                    <p className="text-sm">Completed</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-8 gap-4 bg-slate-200 rounded-xl px-4 py-6 "
                    >
                      <div className="col-span-1">
                        <Input
                          type="checkbox"
                          className={`rounded-full ${task.completed
                            ? "bg-green-600 border-green-600"
                            : "bg-black border-black"
                            }`}
                          checked={task.completed}
                          onChange={() => handleCompleted(index)}
                        />
                      </div>
                      <div className="col-span-4">
                        <h3
                          className={`text-sm ${task.completed ? "line-through" : ""
                            }`}
                        >
                          {task.title}
                        </h3>
                      </div>

                      <div className="col-span-2">
                        <p className="bg-green-300 px-2 rounded-2xl">
                          {task.status}
                        </p>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="w-4 h-4 text-slate-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className=" bg-slate-300 rounded-2xl py-2">
                <div className="footer-content p-4">
                  <Input
                    type="text"
                    className="bg-slate-300 border-0 text-sm text-black w-full"
                    Placeholder={"Message pour Francis KONAN"}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </div>
                <div className="footer-bootom flex flex-row gap-2 justify-between px-4">
                  <div className="flex flex-row gap-4 items-center">
                    <button
                      onClick={handleAddTask}
                      className="btn btn-primary px-4 py-2 rounded-2xl bg-white font-bold text-2xl text-slate-400"
                    >
                      +
                    </button>
                    <FontAwesomeIcon
                      icon={faFaceSmile}
                      className="w-8 h-8 text-slate-500"
                    />
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className="w-8 h-8 text-slate-500"
                    />
                    <i className="fa fa-paperclip"></i>
                  </div>

                  <div className="flex flex-row gap-2 px-6 py-2 rounded-xl bg-black">
                    <button
                      className="btn btn-primary  text-white"
                      onClick={handleAddTask}
                    >
                      Envoyer
                    </button>
                    <VerticalBar />
                    <div className="flex items-center justify-center">
                      <div onClick={handleClick}>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="w-4 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    </>
  );
}
