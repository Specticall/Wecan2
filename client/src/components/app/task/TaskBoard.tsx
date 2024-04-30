import { ScrollArea } from "@/components/ui/scrollable";
import TaskCard from "./TaskCard";
import useTaskMutation from "@/hooks/useTaskMutation";
import { TUserTask } from "@/types/general";
import { Params, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
type TGroupedTask = {
  onGoing: TUserTask[];
  completed: TUserTask[];
};

function groupTaskByStatus(task?: TUserTask[]) {
  if (!task) return undefined;

  return task.reduce(
    (grouped: TGroupedTask, task) => {
      if (task.status === "OnGoing") {
        grouped.onGoing.push(task);
        return grouped;
      }

      grouped.completed.push(task);
      return grouped;
    },
    {
      onGoing: [],
      completed: [],
    }
  );
}

const validateURLParams = (param: Params<string>) => {
  const isEmpty = JSON.stringify(param) === "{}";
  const isOnGoing = param.status === "ongoing";
  const isCompleted = param.status === "completed";
  if (isEmpty || isOnGoing || isCompleted) return true;
  return false;
};

export default function TaskBoard() {
  const { taskQuery } = useTaskMutation();
  const groupedTask = groupTaskByStatus(taskQuery.data);
  const params = useParams();
  const navigate = useNavigate();

  const isValidURLParams = validateURLParams(params);

  useEffect(() => {
    if (!isValidURLParams) {
      navigate("/app/task/board/ongoing");
    }
  }, [navigate, isValidURLParams]);

  if (!isValidURLParams) return;
  return (
    <ScrollArea className="bg-white-soft rounded-xl h-0 min-h-full dotted-grid 2xl:min-h-full 2xl:h-full 2xl:max-h-[30rem]">
      {groupedTask && (
        <div
          className={cn(
            "grid grid-cols-2 gap-12 px-12 3xl:px-8 3xl:gap-8",
            params.status && "grid-cols-1"
          )}
        >
          {!params.status ? (
            <>
              <ul className=" flex flex-col gap-12 py-12 3xl:py-8 3xl:gap-8">
                <CategoryIndicator
                  count={groupedTask.onGoing.length}
                  text="On Going"
                />
                {groupedTask.onGoing.map((task) => {
                  return <TaskCard task={task} key={task.id} />;
                })}
              </ul>
              <ul className=" flex flex-col gap-12 py-12  3xl:py-8 3xl:gap-8">
                <CategoryIndicator
                  count={groupedTask.completed.length}
                  text="Completed"
                />
                {groupedTask.completed.map((task) => {
                  return <TaskCard task={task} key={task.id} />;
                })}
              </ul>
            </>
          ) : (
            <ul className=" flex flex-col gap-12 py-12  3xl:py-8 3xl:gap-8">
              <CategoryIndicator
                count={
                  groupedTask[
                    params.status === "ongoing" ? "onGoing" : "completed"
                  ].length
                }
                text={params.status === "ongoing" ? "On Going" : "Completed"}
              />
              {groupedTask[
                params.status === "ongoing" ? "onGoing" : "completed"
              ].map((task) => {
                return <TaskCard task={task} key={task.id} />;
              })}
            </ul>
          )}
        </div>
      )}
    </ScrollArea>
  );
}

function CategoryIndicator({ count, text }: { count: number; text: string }) {
  return (
    <p className="text-light flex items-center justify-start gap-3 text-[1rem] mb-[-1.5rem] 3xl:mb-0">
      {text}
      <div className="text-dark bg-white-soft p-2 rounded-md border-[1px] border-border w-6 h-6 flex items-center justify-center">
        {count}
      </div>
    </p>
  );
}
