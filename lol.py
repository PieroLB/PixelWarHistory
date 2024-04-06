import tkinter as tk

def bouton_clique():
    print("Le bouton a été cliqué !")

# Création de la fenêtre Tkinter
fenetre = tk.Tk()

# Couleur de fond pour le bouton (cela dépend de la couleur du bouton)
background_color = "blue"

# Création du frame qui servira de fond transparent pour le bouton
frame = tk.Frame(fenetre, bg=background_color)
frame.pack(fill="both", expand=True)

# Création du bouton
bouton = tk.Button(frame, text="Cliquez ici", command=bouton_clique, bg=background_color)

# Configuration du bord pour s'assurer qu'il ne soit pas visible
bouton.config(highlightthickness=0)

# Placement du bouton sur le fond transparent
bouton.pack(fill="both", expand=True)

# Lancement de la boucle principale Tkinter
fenetre.mainloop()
