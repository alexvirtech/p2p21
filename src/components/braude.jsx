import { useState, useEffect } from "preact/hooks"

export default function Braude() {
    const tools = ["screen", "whiteboard", "documents"]
    const newProject = {
        title: "New Project",
        code: "12345",
        description: "Temp for descripiton",
        tools: ["screen", "whiteboard", "documents"],
        isPrivate: true,
        github: "https://github.com/alexvirtech/p2p21",
        hosting: "https://p2p21.vercel.app/",
        group: "",
        tasks: [],
    }
    const [project, setProject] = useState(newProject)
    const [edit, setEdit] = useState(true)

    useEffect(() => {
        const pr = localStorage.getItem("project")
        if (pr) {
            setProject(JSON.parse(pr))
        } else {
            setProject(newProject)
        }
    }, [])

    const saveProject = () => {
        localStorage.setItem("project", JSON.stringify(project))
        setEdit(false)
    }

    const editProject = () => {
        setEdit(true)
    }

    const toggleToolItem = (item) => {
        const index = project.tools.indexOf(item)
        if (index === -1) {
            setProject({ ...project, tools: [...project.tools, item] })
        } else {
            setProject({ ...project, tools: project.tools.filter((i) => i !== item) })
        }
        return array
    }

    return (
        <div class="h-full flex flex-col gap-4 text-sm">
            <div class="h-[320px] flex justify-start gap-4">
                <div class="grow h-full border border-slate-400 rounded px-4 py-2">
                    <div class="flex justify-flex gap-2">
                        <div class="w-1/2">
                            <div>Title</div>
                            <div>
                                <input
                                    disabled={!edit}
                                    type="text"
                                    class="border border-slate-300 rounded w-full py-0.5 px-2"
                                    value={project.title}
                                    onInput={(e) => setProject({ ...project, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div class="w-1/2">
                            <div>Code</div>
                            <div>
                                <input
                                    disabled={!edit}
                                    type="text"
                                    class="border border-slate-300 rounded w-full py-0.5 px-2"
                                    value={project.code}
                                    onInput={(e) => setProject({ ...project, code: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Description</div>
                        <textarea
                            disabled={!edit}
                            class="border border-slate-300 rounded w-full py-0.5 px-2"
                            value={project.description}
                            onInput={(e) => setProject({ ...project, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div class="flex justify-start gap-4">
                        <div class="w-[130px]">Collaboration tools</div>
                        <div class="flex justify-start gap-2">
                            {tools.map((tool) => (
                                <div class="flex justify-start gap-2">
                                    <input
                                        disabled={!edit}
                                        type="checkbox"
                                        checked={project.tools.includes(tool)}
                                        onChange={() => toggleToolItem(tool)}
                                    />
                                    <div class="mr-2">{tool}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="flex justify-start gap-4">
                        <div class="w-[130px]">Accessibility</div>
                        <div class="flex justify-start gap-2">
                            <input
                                disabled={!edit}
                                type="radio"
                                name="access"
                                checked={project.isPrivate}
                                onChange={() => setProject({ ...project, isPrivate: !project.isPrivate })}
                            />
                            <div class="mr-2">private</div>
                            <input
                                disabled={!edit}
                                type="radio"
                                name="access"
                                checked={!project.isPrivate}
                                onChange={() => setProject({ ...project, isPrivate: !project.isPrivate })}
                            />
                            <div class="mr-2">public</div>
                        </div>
                    </div>
                    <div>Github Repository</div>
                    <div>
                        <a href={edit ? "#" : project.github} target={!edit && "_blank"}>
                            <input
                                disabled={!edit}
                                type="text"
                                class={"border border-slate-300 rounded w-full py-0.5 px-2 " + (!edit && "text-blue-700 cursor-pointer hover:underline")}
                                value={project.github}
                                onInput={(e) => setProject({ ...project, github: e.target.value })}
                            />
                        </a>
                    </div>
                    <div>Hosting Address</div>
                    <div>
                        <input
                            disabled={!edit}
                            type="text"
                            class="border border-slate-300 rounded w-full py-0.5 px-2"
                            value={project.hosting}
                            onInput={(e) => setProject({ ...project, hosting: e.target.value })}
                        />
                    </div>
                    <div class="flex justify-center py-2">
                        {edit ? (
                            <button
                                class="py-1 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                                onClick={saveProject}
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                class="py-1 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                                onClick={editProject}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div class="w-[300px] h-full border border-slate-400 rounded px-4 py-2">Group</div>
            </div>
            <div class="grow border border-slate-400 rounded px-4 py-2">Tasks</div>
        </div>
    )
}
