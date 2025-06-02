<div align="center">
    <img src="erd/erd_1.png" alt="erd" width="400" height="auto" />
</div>

- A translation record is **fr-FR** for example.
- Each content is a key value pair for a translation, for example: <br />
`{"test.test1.test2": "Hello World"}` is one content.
- Each content value can be grouped by translation `code` and `key` and we will show empty values for those having no match for code and key.

- To get a full list of keys, values create a subquery for each translation name then join them all together!