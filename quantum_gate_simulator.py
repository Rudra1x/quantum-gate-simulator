import streamlit as st
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, DensityMatrix, partial_trace
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram, circuit_drawer, plot_bloch_vector
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import io

st.set_page_config(layout="wide")
st.title("Quantum Gate Simulator with Visualization")
st.sidebar.header("Quantum Circuit Settings")
num_qubits = st.sidebar.slider("Number of Qubits", 1, 3, 2)
qc = QuantumCircuit(num_qubits)
st.sidebar.subheader("Apply Gates")
gate_options = ['id', 'x', 'y', 'z', 'h', 's', 'sdg', 't', 'tdg', 'rx', 'ry', 'rz']
for qubit in range(num_qubits):
    selected_gate = st.sidebar.selectbox(f"Gate on Qubit {qubit}", [None] + gate_options, key=f"gate_{qubit}")
    if selected_gate:
        if selected_gate in ['rx', 'ry', 'rz']:
            angle = st.sidebar.slider(f"Angle for {selected_gate} on Qubit {qubit}", 0.0, 2 * np.pi, 0.5)
            getattr(qc, selected_gate)(angle, qubit)
        else:
            getattr(qc, selected_gate)(qubit)
st.sidebar.subheader("Entanglement (CNOT)")
control = st.sidebar.selectbox("Control Qubit", list(range(num_qubits)), key="control")
target = st.sidebar.selectbox("Target Qubit", list(range(num_qubits)), key="target")
if control != target and st.sidebar.button("Apply CNOT"):
    qc.cx(control, target)
st.subheader("Quantum Circuit")
fig_circuit = circuit_drawer(qc, output='mpl', fold=-1)
st.pyplot(fig_circuit)
simulator = AerSimulator(method='statevector')
t_qc = qc.copy()
t_qc.save_statevector()
result = simulator.run(t_qc).result()
state = result.get_statevector()
st.subheader("Statevector Magnitudes")
data = {
    "State": [f"|{format(i, f'0{num_qubits}b')}\u27e9" for i in range(len(state))],
    "Amplitude": [round(abs(a), 4) for a in state],
    "Probability": [round(abs(a)**2, 4) for a in state]
}
df = pd.DataFrame(data)
st.dataframe(df)
st.subheader("Probability Threshold Filter")
threshold = st.slider("Minimum Probability to Display", 0.0, 1.0, 0.05, 0.01)
filtered_df = df[df["Probability"] >= threshold].reset_index(drop=True)
st.write(f"Number of states with probability ≥ {threshold}: {len(filtered_df)}")
st.dataframe(filtered_df)
def get_bloch_vector(dm):
    """Compute the Bloch vector from a 1-qubit density matrix."""
    bloch_x = 2 * np.real(dm[0, 1])
    bloch_y = 2 * np.imag(dm[1, 0])
    bloch_z = np.real(dm[0, 0] - dm[1, 1])
    return [bloch_x, bloch_y, bloch_z]
st.subheader("Bloch Sphere Visualization")
try:
    dm_full = DensityMatrix(state)
    for i in range(num_qubits):
        reduced_dm = partial_trace(dm_full, [q for q in range(num_qubits) if q != i])
        bloch_vec = get_bloch_vector(reduced_dm.data)
        fig = plot_bloch_vector(bloch_vec, title=f"Qubit {i} Bloch Sphere")
        st.pyplot(fig)
except Exception as e:
    st.error(f"Could not plot Bloch vector for Qubit {i}: {e}")
st.subheader("📊 Measurement Histogram")
counts = state.sample_counts(shots=1024)
hist_df = pd.DataFrame(counts.items(), columns=["State", "Counts"]).sort_values("State")
fig_hist, ax = plt.subplots()
ax.bar(hist_df["State"], hist_df["Counts"], color='#3f51b5')
ax.set_title("Measurement Outcome Histogram")
ax.set_xlabel("State")
ax.set_ylabel("Counts")
plt.tight_layout()
st.pyplot(fig_hist)
hist_pdf_buf = io.BytesIO()
fig_hist.savefig(hist_pdf_buf, format='pdf')
hist_pdf_buf.seek(0)
circuit_pdf_buf = io.BytesIO()
fig_circuit.savefig(circuit_pdf_buf, format='pdf')
circuit_pdf_buf.seek(0)
st.download_button(
    label="Download Circuit Diagram as PDF",
    data=circuit_pdf_buf,
    file_name="circuit_diagram.pdf",
    mime="application/pdf"
)
st.download_button(
    label="Download Measurement Histogram as PDF",
    data=hist_pdf_buf,
    file_name="measurement_histogram.pdf",
    mime="application/pdf"
)
csv = df.to_csv(index=False).encode('utf-8')
st.download_button(
    "Download Statevector Results as CSV",
    csv,
    "statevector_results.csv",
    "text/csv"
)

