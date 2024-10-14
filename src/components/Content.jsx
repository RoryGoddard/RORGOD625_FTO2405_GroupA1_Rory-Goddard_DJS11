function Content(props) {
    // Create a new array based on the array from the props so that we do not mutate state
    const [...previewDataSorted] = props.previewData.sort((a, b) => a.title.localeCompare(b.title))

    return (
        previewDataSorted.map(showPreview => {
            return (
                <div key={showPreview.id}>
                    <img src={showPreview.image} width="100px" />
                    <h1>{showPreview.title}</h1>
                    <p>{showPreview.description}</p>
                </div>
            )
        })
    )
}

export default Content