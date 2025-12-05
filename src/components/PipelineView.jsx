import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

export default function PipelineView({
  jobs,
  stages,
  onDragEnd,
  openJob,
  filterPriority,
}) {
  // Optional filtering by priority (all / high / medium / low)
  const filtered =
    filterPriority === "all"
      ? jobs
      : jobs.filter((j) => j.priority === filterPriority);

  return (
    <div className="overflow-x-auto pb-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 min-w-max">
          {stages.map((stage) => {
            const stageJobs = filtered.filter((j) => j.stage === stage);

            return (
              <Droppable droppableId={stage} key={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 rounded-xl p-4 min-w-[260px] shadow-sm border border-gray-200"
                  >
                    {/* Column header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">{stage}</h3>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {stageJobs.length}
                      </span>
                    </div>

                    {/* Job cards */}
                    <div className="space-y-3">
                      {stageJobs.map((job, index) => (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              onClick={() => openJob(job)}
                              className="bg-white p-3 rounded shadow cursor-pointer border-l-4"
                              style={{
                                borderLeftColor:
                                  job.priority === "high"
                                    ? "#ef4444" // red
                                    : job.priority === "medium"
                                    ? "#f59e0b" // amber
                                    : "#6b7280", // gray
                                ...prov.draggableProps.style,
                              }}
                            >
                              <div className="font-semibold text-gray-900">
                                {job.company}
                              </div>
                              <div className="text-sm text-gray-600">
                                {job.role}
                              </div>

                              <div className="text-xs text-gray-400 mt-2">
                                {job.dates?.applied
                                  ? `Applied ${new Date(
                                      job.dates.applied
                                    ).toLocaleDateString()}`
                                  : `Discovered ${new Date(
                                      job.dates.discovered
                                    ).toLocaleDateString()}`}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
