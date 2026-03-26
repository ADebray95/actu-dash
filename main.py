import dash
from dash import dcc, html

app = dash.Dash(__name__, title="Actu-Dash")

app.layout = html.Div(
    [
        html.H1("Actuarial Dashboard"),
        html.P("Workshop demo — coming soon."),
        dcc.Graph(
            id="placeholder",
            figure={
                "data": [],
                "layout": {"title": "Add your charts here"},
            },
        ),
    ]
)

if __name__ == "__main__":
    app.run(debug=True)
