function Content(props) {
    const previewDataSorted = props.previewData.sort((a, b) => a.title.localeCompare(b.title))

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