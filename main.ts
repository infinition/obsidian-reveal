import { Plugin, setIcon, Menu, TFolder, TFile, TAbstractFile, WorkspaceLeaf, View, ItemView, Notice, ViewStateResult } from 'obsidian';

interface FileExplorerView extends View {
	dom: {
		infinityScroll: {
			rootEl: RootElements;
			compute: () => void;
		};
		navFileContainerEl: HTMLElement;
	};
	fileItems: Record<string, any>;
	createFolderDom(folder: TFolder): any;
}

interface RootElements {
	childrenEl: HTMLElement;
	children: any[];
	vChildren: {
		_children: any[];
		setChildren: (children: any[]) => void;
	};
	file: TAbstractFile;
}

interface ListedFiles {
	files: string[];
	folders: string[];
}

type TransformValue = { num: number; unit: string };
type TransformItem = { name: string; raw: string; recognized: boolean };
interface ParsedTransform {
	items: TransformItem[];
	translateX: TransformValue;
	translateY: TransformValue;
	translateZ: TransformValue;
	rotate: TransformValue;
	rotateX: TransformValue;
	rotateY: TransformValue;
	skewX: TransformValue;
	skewY: TransformValue;
	perspective: TransformValue;
	scaleX: number;
	scaleY: number;
	scaleZ: number;
	active: {
		translateX: boolean;
		translateY: boolean;
		translateZ: boolean;
		rotate: boolean;
		rotateX: boolean;
		rotateY: boolean;
		skewX: boolean;
		skewY: boolean;
		perspective: boolean;
		scaleX: boolean;
		scaleY: boolean;
		scaleZ: boolean;
	};
	present: {
		translate: boolean;
		translateX: boolean;
		translateY: boolean;
		translateZ: boolean;
		rotate: boolean;
		rotateX: boolean;
		rotateY: boolean;
		rotateZ: boolean;
		skew: boolean;
		skewX: boolean;
		skewY: boolean;
		perspective: boolean;
		scale: boolean;
		scaleX: boolean;
		scaleY: boolean;
		scaleZ: boolean;
	};
}

type ShadowValue = { num: number; unit: string };
interface ParsedShadow {
	inset: boolean;
	x: ShadowValue;
	y: ShadowValue;
	blur: ShadowValue;
	spread: ShadowValue;
	color: string | null;
	raw: string;
}

const CONFIG_VIEW_TYPE = 'reveal-config-view';

type SupportedLocale = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt';
type TranslationMap = {
	configFile: string;
	save: string;
	undo: string;
	redo: string;
	liveSaving: string;
	reload: string;
	fileFallback: string;
	cannotReadFile: string;
	fileSaved: string;
	cannotSaveFile: string;
	liveSavingEnabled: string;
	liveSavingDisabled: string;
	color: string;
	alpha: string;
	gradient: string;
	direction: string;
	value: string;
	weight: string;
	transform: string;
	translateX: string;
	translateY: string;
	translateZ: string;
	rotate: string;
	rotateX: string;
	rotateY: string;
	skewX: string;
	skewY: string;
	scaleX: string;
	scaleY: string;
	scaleZ: string;
	perspective: string;
	boxShadow: string;
	textShadow: string;
	shadows: string;
	remove: string;
	addShadow: string;
	inset: string;
	x: string;
	y: string;
	blur: string;
	spread: string;
	colorLabel: string;
	toggleObsidianFolderCommand: string;
	showObsidian: string;
	hideObsidian: string;
	fileNotFound: string;
	openInObsidian: string;
	revealInExplorer: string;
	copyPath: string;
};

const I18N: Record<SupportedLocale, TranslationMap> = {
	en: {
		configFile: 'Config file',
		save: 'Save',
		undo: 'Undo',
		redo: 'Redo',
		liveSaving: 'Live saving',
		reload: 'Reload',
		fileFallback: 'File',
		cannotReadFile: 'Cannot read file',
		fileSaved: 'File saved',
		cannotSaveFile: 'Cannot save file',
		liveSavingEnabled: 'Live saving enabled',
		liveSavingDisabled: 'Live saving disabled',
		color: 'Color',
		alpha: 'Alpha',
		gradient: 'Gradient',
		direction: 'Direction',
		value: 'Value',
		weight: 'Weight',
		transform: 'Transform',
		translateX: 'Translate X',
		translateY: 'Translate Y',
		translateZ: 'Translate Z',
		rotate: 'Rotate',
		rotateX: 'Rotate X',
		rotateY: 'Rotate Y',
		skewX: 'Skew X',
		skewY: 'Skew Y',
		scaleX: 'Scale X',
		scaleY: 'Scale Y',
		scaleZ: 'Scale Z',
		perspective: 'Perspective',
		boxShadow: 'Box shadow',
		textShadow: 'Text shadow',
		shadows: 'Shadows',
		remove: 'Remove',
		addShadow: 'Add shadow',
		inset: 'Inset',
		x: 'X',
		y: 'Y',
		blur: 'Blur',
		spread: 'Spread',
		colorLabel: 'Color',
		toggleObsidianFolderCommand: 'Show/Hide .obsidian folder',
		showObsidian: 'Show .obsidian',
		hideObsidian: 'Hide .obsidian',
		fileNotFound: 'File not found',
		openInObsidian: 'Open in Obsidian',
		revealInExplorer: 'Reveal in explorer',
		copyPath: 'Copy path'
	},
	fr: {
		configFile: 'Fichier de configuration',
		save: 'Enregistrer',
		undo: 'Annuler',
		redo: 'Retablir',
		liveSaving: 'Enregistrement en direct',
		reload: 'Recharger',
		fileFallback: 'Fichier',
		cannotReadFile: 'Impossible de lire le fichier',
		fileSaved: 'Fichier enregistre',
		cannotSaveFile: 'Impossible d enregistrer le fichier',
		liveSavingEnabled: 'Enregistrement en direct active',
		liveSavingDisabled: 'Enregistrement en direct desactive',
		color: 'Couleur',
		alpha: 'Alpha',
		gradient: 'Degrade',
		direction: 'Direction',
		value: 'Valeur',
		weight: 'Poids',
		transform: 'Transformation',
		translateX: 'Translation X',
		translateY: 'Translation Y',
		translateZ: 'Translation Z',
		rotate: 'Rotation',
		rotateX: 'Rotation X',
		rotateY: 'Rotation Y',
		skewX: 'Inclinaison X',
		skewY: 'Inclinaison Y',
		scaleX: 'Echelle X',
		scaleY: 'Echelle Y',
		scaleZ: 'Echelle Z',
		perspective: 'Perspective',
		boxShadow: 'Ombre portee',
		textShadow: 'Ombre de texte',
		shadows: 'Ombres',
		remove: 'Supprimer',
		addShadow: 'Ajouter une ombre',
		inset: 'Interne',
		x: 'X',
		y: 'Y',
		blur: 'Flou',
		spread: 'Etendue',
		colorLabel: 'Couleur',
		toggleObsidianFolderCommand: 'Afficher/Masquer le dossier .obsidian',
		showObsidian: 'Afficher .obsidian',
		hideObsidian: 'Masquer .obsidian',
		fileNotFound: 'Fichier introuvable',
		openInObsidian: 'Ouvrir dans Obsidian',
		revealInExplorer: 'Reveler dans l explorateur',
		copyPath: 'Copier le chemin'
	},
	es: {
		configFile: 'Archivo de configuracion',
		save: 'Guardar',
		undo: 'Deshacer',
		redo: 'Rehacer',
		liveSaving: 'Guardado en vivo',
		reload: 'Recargar',
		fileFallback: 'Archivo',
		cannotReadFile: 'No se puede leer el archivo',
		fileSaved: 'Archivo guardado',
		cannotSaveFile: 'No se puede guardar el archivo',
		liveSavingEnabled: 'Guardado en vivo activado',
		liveSavingDisabled: 'Guardado en vivo desactivado',
		color: 'Color',
		alpha: 'Alfa',
		gradient: 'Degradado',
		direction: 'Direccion',
		value: 'Valor',
		weight: 'Peso',
		transform: 'Transformacion',
		translateX: 'Traslacion X',
		translateY: 'Traslacion Y',
		translateZ: 'Traslacion Z',
		rotate: 'Rotacion',
		rotateX: 'Rotacion X',
		rotateY: 'Rotacion Y',
		skewX: 'Sesgo X',
		skewY: 'Sesgo Y',
		scaleX: 'Escala X',
		scaleY: 'Escala Y',
		scaleZ: 'Escala Z',
		perspective: 'Perspectiva',
		boxShadow: 'Sombra de caja',
		textShadow: 'Sombra de texto',
		shadows: 'Sombras',
		remove: 'Eliminar',
		addShadow: 'Anadir sombra',
		inset: 'Interior',
		x: 'X',
		y: 'Y',
		blur: 'Desenfoque',
		spread: 'Expansion',
		colorLabel: 'Color',
		toggleObsidianFolderCommand: 'Mostrar/Ocultar carpeta .obsidian',
		showObsidian: 'Mostrar .obsidian',
		hideObsidian: 'Ocultar .obsidian',
		fileNotFound: 'Archivo no encontrado',
		openInObsidian: 'Abrir en Obsidian',
		revealInExplorer: 'Mostrar en el explorador',
		copyPath: 'Copiar ruta'
	},
	de: {
		configFile: 'Konfigurationsdatei',
		save: 'Speichern',
		undo: 'Ruckgangig',
		redo: 'Wiederholen',
		liveSaving: 'Live-Speicherung',
		reload: 'Neu laden',
		fileFallback: 'Datei',
		cannotReadFile: 'Datei kann nicht gelesen werden',
		fileSaved: 'Datei gespeichert',
		cannotSaveFile: 'Datei kann nicht gespeichert werden',
		liveSavingEnabled: 'Live-Speicherung aktiviert',
		liveSavingDisabled: 'Live-Speicherung deaktiviert',
		color: 'Farbe',
		alpha: 'Alpha',
		gradient: 'Verlauf',
		direction: 'Richtung',
		value: 'Wert',
		weight: 'Starke',
		transform: 'Transformation',
		translateX: 'Verschiebung X',
		translateY: 'Verschiebung Y',
		translateZ: 'Verschiebung Z',
		rotate: 'Rotation',
		rotateX: 'Rotation X',
		rotateY: 'Rotation Y',
		skewX: 'Schragung X',
		skewY: 'Schragung Y',
		scaleX: 'Skalierung X',
		scaleY: 'Skalierung Y',
		scaleZ: 'Skalierung Z',
		perspective: 'Perspektive',
		boxShadow: 'Box-Schatten',
		textShadow: 'Textschatten',
		shadows: 'Schatten',
		remove: 'Entfernen',
		addShadow: 'Schatten hinzufugen',
		inset: 'Innen',
		x: 'X',
		y: 'Y',
		blur: 'Unscharfe',
		spread: 'Ausbreitung',
		colorLabel: 'Farbe',
		toggleObsidianFolderCommand: 'Ordner .obsidian ein-/ausblenden',
		showObsidian: '.obsidian anzeigen',
		hideObsidian: '.obsidian ausblenden',
		fileNotFound: 'Datei nicht gefunden',
		openInObsidian: 'In Obsidian offnen',
		revealInExplorer: 'Im Explorer anzeigen',
		copyPath: 'Pfad kopieren'
	},
	it: {
		configFile: 'File di configurazione',
		save: 'Salva',
		undo: 'Annulla',
		redo: 'Ripristina',
		liveSaving: 'Salvataggio live',
		reload: 'Ricarica',
		fileFallback: 'File',
		cannotReadFile: 'Impossibile leggere il file',
		fileSaved: 'File salvato',
		cannotSaveFile: 'Impossibile salvare il file',
		liveSavingEnabled: 'Salvataggio live attivato',
		liveSavingDisabled: 'Salvataggio live disattivato',
		color: 'Colore',
		alpha: 'Alpha',
		gradient: 'Gradiente',
		direction: 'Direzione',
		value: 'Valore',
		weight: 'Peso',
		transform: 'Trasformazione',
		translateX: 'Traslazione X',
		translateY: 'Traslazione Y',
		translateZ: 'Traslazione Z',
		rotate: 'Rotazione',
		rotateX: 'Rotazione X',
		rotateY: 'Rotazione Y',
		skewX: 'Inclinazione X',
		skewY: 'Inclinazione Y',
		scaleX: 'Scala X',
		scaleY: 'Scala Y',
		scaleZ: 'Scala Z',
		perspective: 'Prospettiva',
		boxShadow: 'Ombra esterna',
		textShadow: 'Ombra testo',
		shadows: 'Ombre',
		remove: 'Rimuovi',
		addShadow: 'Aggiungi ombra',
		inset: 'Interno',
		x: 'X',
		y: 'Y',
		blur: 'Sfocatura',
		spread: 'Espansione',
		colorLabel: 'Colore',
		toggleObsidianFolderCommand: 'Mostra/Nascondi cartella .obsidian',
		showObsidian: 'Mostra .obsidian',
		hideObsidian: 'Nascondi .obsidian',
		fileNotFound: 'File non trovato',
		openInObsidian: 'Apri in Obsidian',
		revealInExplorer: 'Mostra nell esplora file',
		copyPath: 'Copia percorso'
	},
	pt: {
		configFile: 'Arquivo de configuracao',
		save: 'Salvar',
		undo: 'Desfazer',
		redo: 'Refazer',
		liveSaving: 'Salvamento ao vivo',
		reload: 'Recarregar',
		fileFallback: 'Arquivo',
		cannotReadFile: 'Nao foi possivel ler o arquivo',
		fileSaved: 'Arquivo salvo',
		cannotSaveFile: 'Nao foi possivel salvar o arquivo',
		liveSavingEnabled: 'Salvamento ao vivo ativado',
		liveSavingDisabled: 'Salvamento ao vivo desativado',
		color: 'Cor',
		alpha: 'Alfa',
		gradient: 'Gradiente',
		direction: 'Direcao',
		value: 'Valor',
		weight: 'Peso',
		transform: 'Transformacao',
		translateX: 'Translacao X',
		translateY: 'Translacao Y',
		translateZ: 'Translacao Z',
		rotate: 'Rotacao',
		rotateX: 'Rotacao X',
		rotateY: 'Rotacao Y',
		skewX: 'Inclinacao X',
		skewY: 'Inclinacao Y',
		scaleX: 'Escala X',
		scaleY: 'Escala Y',
		scaleZ: 'Escala Z',
		perspective: 'Perspectiva',
		boxShadow: 'Sombra de caixa',
		textShadow: 'Sombra de texto',
		shadows: 'Sombras',
		remove: 'Remover',
		addShadow: 'Adicionar sombra',
		inset: 'Interna',
		x: 'X',
		y: 'Y',
		blur: 'Desfoque',
		spread: 'Expansao',
		colorLabel: 'Cor',
		toggleObsidianFolderCommand: 'Mostrar/Ocultar pasta .obsidian',
		showObsidian: 'Mostrar .obsidian',
		hideObsidian: 'Ocultar .obsidian',
		fileNotFound: 'Arquivo nao encontrado',
		openInObsidian: 'Abrir no Obsidian',
		revealInExplorer: 'Revelar no explorador',
		copyPath: 'Copiar caminho'
	}
};

function normalizeLocale(locale: string | null | undefined): SupportedLocale {
	const lower = (locale ?? '').toLowerCase();
	if (lower.startsWith('fr')) return 'fr';
	if (lower.startsWith('es')) return 'es';
	if (lower.startsWith('de')) return 'de';
	if (lower.startsWith('it')) return 'it';
	if (lower.startsWith('pt')) return 'pt';
	return 'en';
}

function resolveLocale(appLike: unknown): SupportedLocale {
	const vault = (appLike as { vault?: { getConfig?: (key: string) => unknown } } | null)?.vault;
	const configLocale = typeof vault?.getConfig === 'function' ? vault.getConfig('locale') : null;
	if (typeof configLocale === 'string' && configLocale.trim().length > 0) {
		return normalizeLocale(configLocale);
	}

	const docLang = typeof document !== 'undefined' ? document.documentElement?.lang : '';
	if (docLang) return normalizeLocale(docLang);

	const browserLang = typeof navigator !== 'undefined' ? navigator.language : '';
	return normalizeLocale(browserLang);
}

function tr(appLike: unknown, key: keyof TranslationMap): string {
	const locale = resolveLocale(appLike);
	return I18N[locale][key] || I18N.en[key];
}

class ConfigFileView extends ItemView {
	private filePath: string | null = null;
	private editorEl: HTMLDivElement | null = null;
	private pathEl: HTMLElement | null = null;
	private isDirty: boolean = false;
	private currentText: string = '';
	private liveSaveEnabled: boolean = false;
	private liveSaveButton: HTMLElement | null = null;
	private liveSaveTimeout: number | null = null;
	private popoverEl: HTMLDivElement | null = null;
	private hidePopoverTimeout: number | null = null;
	private activeTokenRange: { start: number; end: number } | null = null;
	private activeTokenType: 'color' | 'gradient' | 'number' | 'enum' | 'transform' | 'shadow' | null = null;
	private activeTokenValue: string | null = null;
	private activeTokenProp: string | null = null;
	private activeShadowIndex: number = 0;
	private isRendering: boolean = false;
	private undoStack: string[] = [];
	private redoStack: string[] = [];
	private historyTimeout: number | null = null;
	private lastRecordedText: string = '';
	private undoButton: HTMLElement | null = null;
	private redoButton: HTMLElement | null = null;
	private keyframeNames: string[] = [];
	private colorVariableMap: Map<string, string> = new Map();

	getViewType(): string {
		return CONFIG_VIEW_TYPE;
	}

	getDisplayText(): string {
		if (!this.filePath) return tr(this.app, 'configFile');
		return this.filePath.split('/').pop() || this.filePath;
	}

	getIcon(): string {
		return 'file-text';
	}

	async onOpen() {
		this.contentEl.empty();
		this.contentEl.addClass('reveal-config-view');

		this.addAction('save', tr(this.app, 'save'), () => this.saveFile());
		this.undoButton = this.addAction('undo', tr(this.app, 'undo'), () => this.undo());
		this.redoButton = this.addAction('redo', tr(this.app, 'redo'), () => this.redo());
		this.updateUndoButtons();
		this.liveSaveButton = this.addAction('zap', tr(this.app, 'liveSaving'), () => this.toggleLiveSave());
		this.liveSaveButton.addClass('reveal-live-action');
		this.updateLiveButton();
		this.addAction('refresh-ccw', tr(this.app, 'reload'), () => this.loadFile());

		const header = this.contentEl.createDiv('reveal-config-header');
		this.pathEl = header.createDiv('reveal-config-path');

		const editorWrap = this.contentEl.createDiv('reveal-config-editor-wrap');
		this.editorEl = editorWrap.createDiv('reveal-config-editor');
		this.editorEl.setAttr('contenteditable', 'true');
		this.editorEl.setAttr('spellcheck', 'false');

		this.editorEl.addEventListener('input', () => this.handleEditorInput());
		this.editorEl.addEventListener('keydown', (event) => this.handleEditorKeydown(event));
		this.editorEl.addEventListener('scroll', () => this.positionPopover());
		this.editorEl.addEventListener('mouseover', (event) => this.handleEditorHover(event));
		this.editorEl.addEventListener('mouseleave', (event) => this.handleEditorLeave(event));

		this.popoverEl = document.createElement('div');
		this.popoverEl.className = 'reveal-token-popover';
		this.popoverEl.addEventListener('mouseenter', () => this.clearHidePopover());
		this.popoverEl.addEventListener('mouseleave', (event) => this.handlePopoverLeave(event));
		document.body.appendChild(this.popoverEl);

		if (this.filePath) {
			this.loadFile();
		}
	}

	async onClose() {
		this.contentEl.empty();
		if (this.liveSaveTimeout) {
			window.clearTimeout(this.liveSaveTimeout);
			this.liveSaveTimeout = null;
		}
		if (this.historyTimeout) {
			window.clearTimeout(this.historyTimeout);
			this.historyTimeout = null;
		}
		if (this.hidePopoverTimeout) {
			window.clearTimeout(this.hidePopoverTimeout);
			this.hidePopoverTimeout = null;
		}
		if (this.popoverEl) {
			this.popoverEl.remove();
			this.popoverEl = null;
		}
	}

	getState(): Record<string, unknown> {
		return { filePath: this.filePath };
	}

	async setState(state: unknown, result: ViewStateResult): Promise<void> {
		const nextPath = (state as { filePath?: string } | null)?.filePath ?? null;
		if (nextPath !== this.filePath) {
			this.filePath = nextPath;
			await this.loadFile();
		}
		result.history = true;
	}

	private updateHeader() {
		if (this.pathEl) {
			const dirtyMark = this.isDirty ? ' *' : '';
			this.pathEl.setText((this.filePath ?? tr(this.app, 'fileFallback')) + dirtyMark);
		}
	}

	private async loadFile() {
		if (!this.filePath || !this.editorEl) return;

		try {
			const content = await this.app.vault.adapter.read(this.filePath);
			this.currentText = content;
			this.lastRecordedText = content;
			this.undoStack = [];
			this.redoStack = [];
			this.updateUndoButtons();
			this.keyframeNames = this.extractKeyframeNames(content);
			this.isDirty = false;
			this.updateHeader();
			this.renderHighlighted(content, false);
		} catch (err) {
			console.error('Error reading file:', this.filePath, err);
			new Notice(tr(this.app, 'cannotReadFile'));
		}
	}

	private async saveFile(silent: boolean = false) {
		if (!this.filePath || !this.editorEl) return;

		try {
			await this.app.vault.adapter.write(this.filePath, this.currentText);
			this.isDirty = false;
			this.updateHeader();
			if (!silent) new Notice(tr(this.app, 'fileSaved'));
		} catch (err) {
			console.error('Error writing file:', this.filePath, err);
			new Notice(tr(this.app, 'cannotSaveFile'));
		}
	}
	private toggleLiveSave() {
		this.liveSaveEnabled = !this.liveSaveEnabled;
		this.updateLiveButton();
		new Notice(this.liveSaveEnabled ? tr(this.app, 'liveSavingEnabled') : tr(this.app, 'liveSavingDisabled'));
	}

	private updateLiveButton() {
		if (!this.liveSaveButton) return;
		this.liveSaveButton.toggleClass('is-active', this.liveSaveEnabled);
		this.liveSaveButton.setAttribute(
			'aria-label',
			this.liveSaveEnabled ? tr(this.app, 'liveSavingEnabled') : tr(this.app, 'liveSavingDisabled')
		);
	}

	private scheduleLiveSave() {
		if (!this.liveSaveEnabled) return;
		if (this.liveSaveTimeout) window.clearTimeout(this.liveSaveTimeout);
		this.liveSaveTimeout = window.setTimeout(() => {
			this.liveSaveTimeout = null;
			this.saveFile(true);
		}, 400);
	}

	private scheduleHistorySnapshot() {
		if (this.historyTimeout) window.clearTimeout(this.historyTimeout);
		this.historyTimeout = window.setTimeout(() => {
			this.historyTimeout = null;
			if (this.currentText !== this.lastRecordedText) {
				this.undoStack.push(this.lastRecordedText);
				this.lastRecordedText = this.currentText;
				this.redoStack = [];
				this.updateUndoButtons();
			}
		}, 500);
	}

	private updateUndoButtons() {
		if (this.undoButton) {
			this.undoButton.toggleClass('is-disabled', this.undoStack.length === 0);
			this.undoButton.setAttribute('aria-disabled', this.undoStack.length === 0 ? 'true' : 'false');
		}
		if (this.redoButton) {
			this.redoButton.toggleClass('is-disabled', this.redoStack.length === 0);
			this.redoButton.setAttribute('aria-disabled', this.redoStack.length === 0 ? 'true' : 'false');
		}
	}

	private undo() {
		if (this.undoStack.length === 0) return;
		if (this.historyTimeout) {
			window.clearTimeout(this.historyTimeout);
			this.historyTimeout = null;
		}
		this.redoStack.push(this.currentText);
		const next = this.undoStack.pop() ?? this.currentText;
		this.currentText = next;
		this.lastRecordedText = next;
		this.isDirty = true;
		this.updateHeader();
		this.updateUndoButtons();
		this.scheduleLiveSave();
		this.renderHighlighted(next, false);
	}

	private redo() {
		if (this.redoStack.length === 0) return;
		if (this.historyTimeout) {
			window.clearTimeout(this.historyTimeout);
			this.historyTimeout = null;
		}
		this.undoStack.push(this.currentText);
		const next = this.redoStack.pop() ?? this.currentText;
		this.currentText = next;
		this.lastRecordedText = next;
		this.isDirty = true;
		this.updateHeader();
		this.updateUndoButtons();
		this.scheduleLiveSave();
		this.renderHighlighted(next, false);
	}

	private handleEditorKeydown(event: KeyboardEvent) {
		const key = event.key.toLowerCase();
		const isMac = navigator.platform.toLowerCase().includes('mac');
		const modKey = isMac ? event.metaKey : event.ctrlKey;
		if (!modKey) return;

		if (!event.shiftKey && key === 'z') {
			event.preventDefault();
			this.undo();
			return;
		}

		if ((event.shiftKey && key === 'z') || key === 'y') {
			event.preventDefault();
			this.redo();
		}
	}

	private handleEditorInput() {
		if (!this.editorEl || this.isRendering) return;
		const text = this.getEditorText();
		this.currentText = text;
		this.isDirty = true;
		this.updateHeader();
		this.scheduleHistorySnapshot();
		this.keyframeNames = this.extractKeyframeNames(text);
		this.scheduleLiveSave();
		this.renderHighlighted(text, true);
	}

	private getEditorText(): string {
		if (!this.editorEl) return '';
		return this.editorEl.innerText.replace(/\r\n/g, '\n');
	}

	private renderHighlighted(text: string, keepSelection: boolean) {
		if (!this.editorEl) return;
		const selection = keepSelection ? this.getSelectionOffsets() : null;
		const scrollTop = this.editorEl.scrollTop;
		const scrollLeft = this.editorEl.scrollLeft;
		this.isRendering = true;
		this.editorEl.innerHTML = this.buildHighlightedHtml(text);
		this.isRendering = false;
		this.editorEl.scrollTop = scrollTop;
		this.editorEl.scrollLeft = scrollLeft;
		if (selection) {
			this.restoreSelection(selection);
		}
	}

	private buildHighlightedHtml(text: string): string {
		this.colorVariableMap = this.buildColorVariableMap(text);
		const tokens = this.findTokens(text);
		if (tokens.length === 0) return this.escapeHtml(text);

		let html = '';
		let cursor = 0;
		for (const token of tokens) {
			if (token.start > cursor) {
				html += this.escapeHtml(text.slice(cursor, token.start));
			}
			const raw = text.slice(token.start, token.end);
			const encoded = encodeURIComponent(raw);
			let styleAttr = '';
			const propAttr = token.prop ? ` data-token-prop="${this.escapeAttr(token.prop)}"` : '';
			if (token.type === 'color') {
				let resolved = this.resolveColorTokenValue(raw);
				const colorValue = resolved ?? raw;
				let accent = colorValue;
				const lower = accent.trim().toLowerCase();
				if (lower === 'transparent' || lower === 'currentcolor') accent = 'var(--text-accent)';
				styleAttr = ` style="--reveal-token-color: ${this.escapeAttr(colorValue)}; --reveal-token-accent: ${this.escapeAttr(accent)};"`;
			}
			if (token.type === 'gradient') {
				const gradientValue = this.resolveGradientTokenValue(raw) ?? raw;
				styleAttr = ` style="--reveal-token-gradient: ${this.escapeAttr(gradientValue)};"`;
			}
			html += `<span class="reveal-token reveal-token-${token.type}" data-token-type="${token.type}" data-token-start="${token.start}" data-token-end="${token.end}" data-token-value="${encoded}"${propAttr}${styleAttr}>${this.escapeHtml(raw)}</span>`;
			cursor = token.end;
		}
		if (cursor < text.length) {
			html += this.escapeHtml(text.slice(cursor));
		}
		return html;
	}

	private findTokens(text: string): { start: number; end: number; type: 'color' | 'gradient' | 'number' | 'enum' | 'transform' | 'shadow'; prop?: string }[] {
		const tokens: { start: number; end: number; type: 'color' | 'gradient' | 'number' | 'enum' | 'transform' | 'shadow'; prop?: string }[] = [];
		const gradients = this.findGradientTokens(text);
		tokens.push(...gradients);

		const shadows = this.findShadowTokens(text).filter((token) => !tokens.some((existing) => this.rangesOverlap(existing, token)));
		tokens.push(...shadows);

		const transforms = this.findTransformTokens(text).filter((token) => !tokens.some((existing) => this.rangesOverlap(existing, token)));
		tokens.push(...transforms);

		const colors = this.findColorTokens(text).filter((token) => !tokens.some((existing) => this.rangesOverlap(existing, token)));
		tokens.push(...colors);

		const enums = this.findEnumTokens(text).filter((token) => !tokens.some((existing) => this.rangesOverlap(existing, token)));
		tokens.push(...enums);

		const numbers = this.findNumberTokens(text).filter((token, index, list) => {
			if (tokens.some((existing) => this.rangesOverlap(existing, token))) return false;
			for (let i = 0; i < index; i++) {
				if (this.rangesOverlap(list[i], token)) return false;
			}
			return true;
		});
		tokens.push(...numbers);

		return tokens.sort((a, b) => a.start - b.start);
	}

	private findGradientTokens(text: string): { start: number; end: number; type: 'gradient' }[] {
		const tokens: { start: number; end: number; type: 'gradient' }[] = [];
		const names = ['linear-gradient', 'radial-gradient', 'conic-gradient'];
		const lower = text.toLowerCase();

		for (const name of names) {
			let idx = 0;
			while ((idx = lower.indexOf(name + '(', idx)) !== -1) {
				const start = idx;
				let i = idx + name.length;
				if (text[i] !== '(') {
					idx += name.length;
					continue;
				}
				let depth = 0;
				for (; i < text.length; i++) {
					const ch = text[i];
					if (ch === '(') depth++;
					else if (ch === ')') {
						depth--;
						if (depth === 0) {
							i++;
							break;
						}
					}
				}
				if (depth === 0) {
					tokens.push({ start, end: i, type: 'gradient' });
					idx = i;
				} else {
					idx = start + name.length;
				}
			}
		}

		const varRegex = /var\(--[a-z0-9-_]+(?:\s*,\s*[^)]+)?\)/gi;
		let varMatch: RegExpExecArray | null;
		while ((varMatch = varRegex.exec(text)) !== null) {
			const raw = varMatch[0];
			const resolved = this.resolveGradientTokenValue(raw);
			if (!resolved) continue;
			tokens.push({ start: varMatch.index, end: varMatch.index + raw.length, type: 'gradient' });
		}

		return tokens;
	}

	private findColorTokens(text: string): { start: number; end: number; type: 'color' }[] {
		const tokens: { start: number; end: number; type: 'color' }[] = [];
		const regex = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b|\bcurrentcolor\b|var\(--[a-z0-9-_]+(?:\s*,\s*[^)]+)?\)/gi;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			const raw = match[0];
			if (/^var\(/i.test(raw)) {
				const resolved = this.resolveColorFromValue(raw, this.colorVariableMap, new Set<string>());
				if (!resolved) continue;
			}
			tokens.push({ start: match.index, end: match.index + match[0].length, type: 'color' });
		}
		return tokens;
	}

	private buildColorVariableMap(text: string): Map<string, string> {
		const map = new Map<string, string>();
		const regex = /--([a-z0-9-_]+)\s*:\s*([^;]+);/gi;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			const name = `--${match[1].toLowerCase()}`;
			const value = match[2].trim();
			map.set(name, value);
		}
		return map;
	}

	private resolveColorTokenValue(value: string): string | null {
		const trimmed = value.trim();
		if (!trimmed.toLowerCase().startsWith('var(')) return null;
		return this.resolveColorFromValue(trimmed, this.colorVariableMap, new Set<string>());
	}

	private resolveColorFromValue(value: string, map: Map<string, string>, stack: Set<string>): string | null {
		const direct = this.extractColorLiteral(value);
		if (direct) return direct;
		const varInfo = this.parseVarFunction(value);
		if (!varInfo) return null;
		const resolved = this.resolveColorFromVar(varInfo.name, map, stack);
		if (resolved) return resolved;
		if (varInfo.fallback) {
			return this.resolveColorFromValue(varInfo.fallback, map, stack);
		}
		return null;
	}

	private resolveColorFromVar(name: string, map: Map<string, string>, stack: Set<string>): string | null {
		const key = name.toLowerCase();
		if (stack.has(key)) return null;
		const raw = map.get(key);
		if (!raw) return null;
		stack.add(key);
		const direct = this.extractColorLiteral(raw);
		if (direct) return direct;
		const varInfo = this.parseVarFunction(raw);
		if (varInfo) {
			const resolved = this.resolveColorFromVar(varInfo.name, map, stack);
			if (resolved) return resolved;
			if (varInfo.fallback) {
				const fallback = this.resolveColorFromValue(varInfo.fallback, map, stack);
				if (fallback) return fallback;
			}
		}
		stack.delete(key);
		return null;
	}

	private resolveGradientTokenValue(value: string): string | null {
		const trimmed = value.trim();
		if (this.isGradientValue(trimmed)) return trimmed;
		if (!trimmed.toLowerCase().startsWith('var(')) return null;
		const resolved = this.resolveVariableValue(trimmed, new Set<string>());
		if (!resolved) return null;
		return this.isGradientValue(resolved) ? resolved : null;
	}

	private resolveVariableValue(value: string, stack: Set<string>): string | null {
		const trimmed = value.trim();
		const varInfo = this.parseVarFunction(trimmed);
		if (!varInfo) return null;
		const key = varInfo.name.toLowerCase();
		if (stack.has(key)) return null;
		const raw = this.colorVariableMap.get(key);
		if (raw) {
			const rawTrimmed = raw.trim();
			if (rawTrimmed.toLowerCase().startsWith('var(')) {
				stack.add(key);
				const nested = this.resolveVariableValue(rawTrimmed, stack);
				stack.delete(key);
				if (nested) return nested;
			}
			return rawTrimmed;
		}
		if (varInfo.fallback) {
			return varInfo.fallback.trim();
		}
		return null;
	}

	private parseVarFunction(value: string): { name: string; fallback: string | null } | null {
		const match = value.match(/^var\(\s*(--[a-z0-9-_]+)\s*(?:,\s*(.+))?\)$/i);
		if (!match) return null;
		return { name: match[1], fallback: match[2]?.trim() ?? null };
	}

	private isGradientValue(value: string): boolean {
		return /^(linear-gradient|radial-gradient|conic-gradient)\(/i.test(value.trim());
	}

	private extractColorLiteral(value: string): string | null {
		const regex = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b|\bcurrentcolor\b/i;
		const match = value.match(regex);
		return match ? match[0] : null;
	}

	private findTransformTokens(text: string): { start: number; end: number; type: 'transform'; prop: string }[] {
		const tokens: { start: number; end: number; type: 'transform'; prop: string }[] = [];
		const propRegex = /(^|[;\n])\s*(transform)\s*:\s*([^;\n]+)/gi;
		let propMatch: RegExpExecArray | null;
		while ((propMatch = propRegex.exec(text)) !== null) {
			const valueRaw = propMatch[3];
			const trimmedValue = valueRaw.trim();
			if (!trimmedValue) continue;
			const leading = valueRaw.indexOf(trimmedValue);
			const valueStart = propMatch.index + propMatch[0].length - valueRaw.length + Math.max(0, leading);
			const valueEnd = valueStart + trimmedValue.length;
			tokens.push({ start: valueStart, end: valueEnd, type: 'transform', prop: 'transform' });
		}
		return tokens;
	}

	private findShadowTokens(text: string): { start: number; end: number; type: 'shadow'; prop: string }[] {
		const tokens: { start: number; end: number; type: 'shadow'; prop: string }[] = [];
		const propRegex = /(^|[;\n])\s*(box-shadow|text-shadow)\s*:\s*([^;\n]+)/gi;
		let propMatch: RegExpExecArray | null;
		while ((propMatch = propRegex.exec(text)) !== null) {
			const prop = propMatch[2].toLowerCase();
			const valueRaw = propMatch[3];
			const trimmedValue = valueRaw.trim();
			if (!trimmedValue) continue;
			const leading = valueRaw.indexOf(trimmedValue);
			const valueStart = propMatch.index + propMatch[0].length - valueRaw.length + Math.max(0, leading);
			const valueEnd = valueStart + trimmedValue.length;
			tokens.push({ start: valueStart, end: valueEnd, type: 'shadow', prop });
		}
		return tokens;
	}

	private findEnumTokens(text: string): { start: number; end: number; type: 'enum'; prop: string }[] {
		const tokens: { start: number; end: number; type: 'enum'; prop: string }[] = [];
		const pushToken = (start: number, end: number, prop: string) => {
			for (const existing of tokens) {
				if (this.rangesOverlap(existing, { start, end })) return;
			}
			tokens.push({ start, end, type: 'enum', prop });
		};
		const enumProps = new Set([
			'display',
			'position',
			'overflow',
			'overflow-x',
			'overflow-y',
			'visibility',
			'pointer-events',
			'cursor',
			'flex-direction',
			'justify-content',
			'justify-items',
			'justify-self',
			'align-items',
			'align-content',
			'align-self',
			'flex-wrap',
			'text-transform',
			'text-align',
			'text-decoration',
			'text-decoration-line',
			'font-style',
			'font-variant',
			'font-stretch',
			'font-family',
			'font-weight',
			'white-space',
			'word-break',
			'background-repeat',
			'background-size',
			'background-attachment',
			'background-clip',
			'background-origin',
			'border-style',
			'object-fit',
			'animation',
			'animation-name',
			'animation-timing-function',
			'animation-direction',
			'animation-fill-mode',
			'animation-play-state',
			'animation-iteration-count'
		]);

		const propRegex = /(^|[;\n])\s*([a-z-]+)\s*:\s*([^;\n]+)/gi;
		let propMatch: RegExpExecArray | null;
		while ((propMatch = propRegex.exec(text)) !== null) {
			const rawProp = propMatch[2];
			const prop = rawProp.toLowerCase();
			const valueRaw = propMatch[3];
			const trimmedValue = valueRaw.trimStart();
			if (!trimmedValue) continue;
			const leading = valueRaw.length - trimmedValue.length;
			const valueStart = propMatch.index + propMatch[0].length - valueRaw.length + leading;
			const resolvedValue = this.resolveVariableValue(trimmedValue, new Set<string>()) ?? trimmedValue;
			const effectiveProp = prop.startsWith('--font') ? 'font-family' : prop;

			if ((effectiveProp === 'font-weight' || effectiveProp === 'animation-iteration-count') && /^-?\d/.test(resolvedValue)) {
				continue;
			}

			if (effectiveProp === 'animation') {
				if (trimmedValue.trim().toLowerCase().startsWith('var(')) {
					pushToken(valueStart, valueStart + trimmedValue.length, 'animation');
					continue;
				}
				const nameSet = new Set(this.keyframeNames.map((name) => name.toLowerCase()));
				const timingSet = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end']);
				const directionSet = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse']);
				const fillSet = new Set(['none', 'forwards', 'backwards', 'both']);
				const playSet = new Set(['running', 'paused']);
				const iterationSet = new Set(['infinite']);

				const specialRegex = /(steps\([^)]*\)|cubic-bezier\([^)]*\))/gi;
				let specialMatch: RegExpExecArray | null;
				while ((specialMatch = specialRegex.exec(resolvedValue)) !== null) {
					const start = valueStart + specialMatch.index;
					const end = start + specialMatch[0].length;
					pushToken(start, end, 'animation-timing-function');
				}

				const wordRegex = /[a-zA-Z_-][\w-]*/g;
				let wordMatch: RegExpExecArray | null;
				while ((wordMatch = wordRegex.exec(resolvedValue)) !== null) {
					const word = wordMatch[0];
					const lower = word.toLowerCase();
					let tokenProp: string | null = null;
					if (nameSet.has(lower)) tokenProp = 'animation-name';
					else if (timingSet.has(lower)) tokenProp = 'animation-timing-function';
					else if (directionSet.has(lower)) tokenProp = 'animation-direction';
					else if (fillSet.has(lower)) tokenProp = 'animation-fill-mode';
					else if (playSet.has(lower)) tokenProp = 'animation-play-state';
					else if (iterationSet.has(lower)) tokenProp = 'animation-iteration-count';
					if (!tokenProp) continue;
					const start = valueStart + (wordMatch.index ?? 0);
					const end = start + word.length;
					pushToken(start, end, tokenProp);
				}
				continue;
			}

			if (prop.startsWith('border') && !trimmedValue.trim().toLowerCase().startsWith('var(')) {
				const borderStyles = new Set(['none', 'hidden', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']);
				const wordRegex = /[a-zA-Z_-][\w-]*/g;
				let wordMatch: RegExpExecArray | null;
				while ((wordMatch = wordRegex.exec(resolvedValue)) !== null) {
					const word = wordMatch[0].toLowerCase();
					if (!borderStyles.has(word)) continue;
					const start = valueStart + (wordMatch.index ?? 0);
					const end = start + word.length;
					pushToken(start, end, 'border-style');
				}
			}

			if (!enumProps.has(effectiveProp) && effectiveProp !== 'font-family') continue;

			let tokenStart = valueStart;
			let tokenEnd = valueStart + trimmedValue.length;

			if (trimmedValue.trim().toLowerCase().startsWith('var(')) {
				tokenStart = valueStart;
				tokenEnd = valueStart + trimmedValue.length;
			} else if (effectiveProp === 'font-family') {
				const commaIndex = resolvedValue.indexOf(',');
				if (commaIndex !== -1) tokenEnd = valueStart + commaIndex;
			} else if (effectiveProp === 'animation-name') {
				const nameMatch = resolvedValue.match(/^[\w-]+/);
				if (nameMatch) tokenEnd = valueStart + nameMatch[0].length;
			} else {
				const wordMatch = resolvedValue.match(/^[\w-]+/);
				if (wordMatch) tokenEnd = valueStart + wordMatch[0].length;
			}

			pushToken(tokenStart, tokenEnd, effectiveProp);
		}

		return tokens;
	}

	private findNumberTokens(text: string): { start: number; end: number; type: 'number'; prop?: string }[] {
		const tokens: { start: number; end: number; type: 'number'; prop?: string }[] = [];
		const numericProps = new Set([
			'z-index',
			'opacity',
			'line-height',
			'font-weight',
			'font-size',
			'letter-spacing',
			'border',
			'border-top',
			'border-right',
			'border-bottom',
			'border-left',
			'background-position',
			'width',
			'height',
			'min-width',
			'max-width',
			'min-height',
			'max-height',
			'animation-iteration-count',
			'animation-duration',
			'animation-delay',
			'transition-duration',
			'transition-delay',
			'top',
			'left',
			'right',
			'bottom',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'gap',
			'row-gap',
			'column-gap',
			'border-radius',
			'border-width',
			'outline-width',
			'stroke-width',
			'transform-origin'
		]);
		const propRegex = /(^|[;\n])\s*([a-z-]+)\s*:\s*([^;\n]+)/gi;
		let propMatch: RegExpExecArray | null;
		while ((propMatch = propRegex.exec(text)) !== null) {
			const prop = propMatch[2].toLowerCase();
			if (!numericProps.has(prop)) continue;
			const valueRaw = propMatch[3];
			const valueStart = propMatch.index + propMatch[0].length - valueRaw.length;
			const numberRegex = /-?\d*\.?\d+(?:px|rem|em|vh|vw|vmin|vmax|%|deg|s|ms|fr)?/gi;
			let numberMatch: RegExpExecArray | null;
			while ((numberMatch = numberRegex.exec(valueRaw)) !== null) {
				const start = valueStart + numberMatch.index;
				const end = start + numberMatch[0].length;
				tokens.push({ start, end, type: 'number', prop });
			}
		}

		const regex = /-?\d*\.?\d+(?:px|rem|em|vh|vw|vmin|vmax|%|deg|s|ms|fr)\b/gi;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			tokens.push({ start: match.index, end: match.index + match[0].length, type: 'number' });
		}

		return tokens;
	}

	private rangesOverlap(
		a: { start: number; end: number },
		b: { start: number; end: number }
	): boolean {
		return a.start < b.end && b.start < a.end;
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	private escapeAttr(text: string): string {
		return this.escapeHtml(text);
	}

	private getSelectionOffsets(): { start: number; end: number } | null {
		if (!this.editorEl) return null;
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return null;
		const range = selection.getRangeAt(0);
		if (!this.editorEl.contains(range.startContainer) || !this.editorEl.contains(range.endContainer)) return null;

		const start = this.getOffsetFromNode(range.startContainer, range.startOffset);
		const end = this.getOffsetFromNode(range.endContainer, range.endOffset);
		return { start, end };
	}

	private getOffsetFromNode(node: Node, offset: number): number {
		if (!this.editorEl) return 0;
		let count = 0;
		const walker = document.createTreeWalker(this.editorEl, NodeFilter.SHOW_TEXT, null);
		while (walker.nextNode()) {
			const textNode = walker.currentNode as Text;
			if (textNode === node) return count + offset;
			count += textNode.nodeValue?.length ?? 0;
		}
		return count;
	}

	private getNodeAtOffset(offset: number): { node: Text; offset: number } | null {
		if (!this.editorEl) return null;
		let count = 0;
		const walker = document.createTreeWalker(this.editorEl, NodeFilter.SHOW_TEXT, null);
		while (walker.nextNode()) {
			const textNode = walker.currentNode as Text;
			const length = textNode.nodeValue?.length ?? 0;
			if (count + length >= offset) {
				return { node: textNode, offset: offset - count };
			}
			count += length;
		}
		return null;
	}

	private restoreSelection(selection: { start: number; end: number }) {
		if (!this.editorEl) return;
		const startPos = this.getNodeAtOffset(selection.start);
		const endPos = this.getNodeAtOffset(selection.end);
		if (!startPos || !endPos) return;

		const range = document.createRange();
		range.setStart(startPos.node, startPos.offset);
		range.setEnd(endPos.node, endPos.offset);

		const sel = window.getSelection();
		if (!sel) return;
		sel.removeAllRanges();
		sel.addRange(range);
	}

	private handleEditorHover(event: MouseEvent) {
		const target = event.target as HTMLElement | null;
		const tokenEl = target?.closest('.reveal-token') as HTMLElement | null;
		if (!tokenEl || !this.editorEl?.contains(tokenEl)) {
			this.scheduleHidePopover();
			return;
		}
		this.showPopoverForToken(tokenEl);
	}

	private handleEditorLeave(event: MouseEvent) {
		const related = event.relatedTarget as HTMLElement | null;
		if (related && this.popoverEl && this.popoverEl.contains(related)) return;
		this.scheduleHidePopover();
	}

	private handlePopoverLeave(event: MouseEvent) {
		const related = event.relatedTarget as HTMLElement | null;
		if (related && this.editorEl && this.editorEl.contains(related)) return;
		this.scheduleHidePopover();
	}

	private showPopoverForToken(tokenEl: HTMLElement) {
		if (!this.popoverEl) return;
		this.clearHidePopover();

		const type = (tokenEl.dataset.tokenType || '') as 'color' | 'gradient' | 'number' | 'enum' | 'transform' | 'shadow';
		const value = tokenEl.dataset.tokenValue ? decodeURIComponent(tokenEl.dataset.tokenValue) : '';
		const prop = tokenEl.dataset.tokenProp ?? null;
		const start = Number(tokenEl.dataset.tokenStart);
		const end = Number(tokenEl.dataset.tokenEnd);

		if (!type || Number.isNaN(start) || Number.isNaN(end)) return;

		if (
			this.activeTokenRange &&
			this.activeTokenRange.start === start &&
			this.activeTokenRange.end === end &&
			this.activeTokenType === type &&
			this.activeTokenValue === value &&
			this.activeTokenProp === prop
		) {
			this.positionPopover();
			return;
		}

		this.activeTokenRange = { start, end };
		this.activeTokenType = type;
		this.activeTokenValue = value;
		this.activeTokenProp = prop;

		this.popoverEl.innerHTML = '';
		this.popoverEl.style.display = 'block';

		if (type === 'color') this.buildColorPopover(value);
		else if (type === 'gradient') this.buildGradientPopover(value);
		else if (type === 'enum') this.buildEnumPopover(value, prop);
		else if (type === 'transform') this.buildTransformPopover(value);
		else if (type === 'shadow') this.buildShadowPopover(value, prop);
		else this.buildNumberPopover(value, prop);

		this.positionPopover();
	}

	private buildColorPopover(value: string) {
		if (!this.popoverEl) return;

		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = tr(this.app, 'color');
		this.popoverEl.appendChild(title);

		const row = document.createElement('div');
		row.className = 'reveal-popover-row';
		this.popoverEl.appendChild(row);

		const colorInput = document.createElement('input');
		colorInput.type = 'color';
		colorInput.className = 'reveal-color-input';

		const textInput = document.createElement('input');
		textInput.type = 'text';
		textInput.className = 'reveal-text-input';
		textInput.value = value;

		row.appendChild(colorInput);
		row.appendChild(textInput);

		const resolved = this.resolveColorTokenValue(value) ?? value;
		const rgba = this.parseColor(resolved);
		const hasAlpha =
			/(rgba|hsla)/i.test(value) || /#(?:[0-9a-f]{8})\b/i.test(value) || (rgba ? rgba.a < 1 : false);

		if (rgba) {
			colorInput.value = this.rgbToHex(rgba.r, rgba.g, rgba.b);
		}

		let alphaInput: HTMLInputElement | null = null;
		if (hasAlpha) {
			const alphaRow = document.createElement('div');
			alphaRow.className = 'reveal-popover-row';
			this.popoverEl.appendChild(alphaRow);

			const alphaLabel = document.createElement('div');
			alphaLabel.className = 'reveal-popover-label';
			alphaLabel.textContent = tr(this.app, 'alpha');
			alphaRow.appendChild(alphaLabel);

			alphaInput = document.createElement('input');
			alphaInput.type = 'range';
			alphaInput.min = '0';
			alphaInput.max = '1';
			alphaInput.step = '0.01';
			alphaInput.value = rgba ? String(rgba.a) : '1';
			alphaInput.className = 'reveal-range';
			alphaRow.appendChild(alphaInput);
		}

		const applyColor = (nextValue: string) => {
			textInput.value = nextValue;
			this.applyTokenReplacement(nextValue);
		};

		colorInput.addEventListener('input', () => {
			const nextRgb = this.hexToRgb(colorInput.value);
			if (!nextRgb) return;
			const alpha = alphaInput ? parseFloat(alphaInput.value) : rgba?.a ?? 1;
			const nextValue = this.formatColorOutput(nextRgb.r, nextRgb.g, nextRgb.b, alpha, value);
			applyColor(nextValue);
		});

		const alphaControl = alphaInput;
		if (alphaControl) {
			alphaControl.addEventListener('input', () => {
				const nextRgb = this.hexToRgb(colorInput.value);
				if (!nextRgb) return;
				const alpha = parseFloat(alphaControl.value);
				const nextValue = this.formatColorOutput(nextRgb.r, nextRgb.g, nextRgb.b, alpha, value);
				applyColor(nextValue);
			});
		}

		textInput.addEventListener('change', () => {
			const next = textInput.value.trim();
			const parsed = this.parseColor(next);
			if (parsed) {
				colorInput.value = this.rgbToHex(parsed.r, parsed.g, parsed.b);
				if (alphaInput) alphaInput.value = String(parsed.a);
			}
			this.applyTokenReplacement(next);
		});
	}

	private buildGradientPopover(value: string) {
		if (!this.popoverEl) return;
		const resolvedValue = this.resolveGradientTokenValue(value) ?? value;

		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = tr(this.app, 'gradient');
		this.popoverEl.appendChild(title);

		const preview = document.createElement('div');
		preview.className = 'reveal-gradient-preview';
		preview.style.background = resolvedValue;
		this.popoverEl.appendChild(preview);

		const gradient = this.parseGradient(resolvedValue);
		if (!gradient) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'reveal-text-input';
			input.value = value;
			row.appendChild(input);
			this.popoverEl.appendChild(row);
			input.addEventListener('change', () => this.applyTokenReplacement(input.value.trim()));
			return;
		}

		const updateGradient = () => {
			const stops = gradient.stops.map((stop) => stop.color + (stop.position ? ` ${stop.position}` : ''));
			const args = [];
			if (gradient.prefix) args.push(gradient.prefix);
			args.push(...stops);
			const nextValue = `${gradient.type}(${args.join(', ')})`;
			preview.style.background = nextValue;
			this.applyTokenReplacement(nextValue);
		};

		if (gradient.prefix) {
			const prefixRow = document.createElement('div');
			prefixRow.className = 'reveal-popover-row';
			const prefixLabel = document.createElement('div');
			prefixLabel.className = 'reveal-popover-label';
			prefixLabel.textContent = tr(this.app, 'direction');
			prefixRow.appendChild(prefixLabel);
			const prefixInput = document.createElement('input');
			prefixInput.type = 'text';
			prefixInput.className = 'reveal-text-input';
			prefixInput.value = gradient.prefix;
			prefixRow.appendChild(prefixInput);
			this.popoverEl.appendChild(prefixRow);
			prefixInput.addEventListener('change', () => {
				gradient.prefix = prefixInput.value.trim() || null;
				updateGradient();
			});
		}

		for (const stop of gradient.stops) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';

			const colorInput = document.createElement('input');
			colorInput.type = 'color';
			colorInput.className = 'reveal-color-input';

			const colorText = document.createElement('input');
			colorText.type = 'text';
			colorText.className = 'reveal-text-input';
			colorText.value = stop.color;

			const rgba = this.parseColor(stop.color);
			if (rgba) {
				colorInput.value = this.rgbToHex(rgba.r, rgba.g, rgba.b);
			} else {
				colorInput.disabled = true;
			}

			colorInput.addEventListener('input', () => {
				const next = colorInput.value;
				stop.color = next;
				colorText.value = next;
				updateGradient();
			});

			colorText.addEventListener('change', () => {
				stop.color = colorText.value.trim();
				const parsed = this.parseColor(stop.color);
				if (parsed) colorInput.value = this.rgbToHex(parsed.r, parsed.g, parsed.b);
				updateGradient();
			});

			const posInput = document.createElement('input');
			posInput.type = 'text';
			posInput.className = 'reveal-text-input';
			posInput.value = stop.position ?? '';
			posInput.addEventListener('change', () => {
				const nextPos = posInput.value.trim();
				stop.position = nextPos.length > 0 ? nextPos : null;
				updateGradient();
			});

			row.appendChild(colorInput);
			row.appendChild(colorText);
			row.appendChild(posInput);
			this.popoverEl.appendChild(row);
		}
	}

	private buildEnumPopover(value: string, prop: string | null) {
		if (!this.popoverEl) return;
		const options = this.getEnumOptions(prop);
		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = prop ? prop : tr(this.app, 'value');
		this.popoverEl.appendChild(title);

		const normalized = prop === 'font-family' ? this.normalizeFontFamily(value) : value;
		let select: HTMLSelectElement | null = null;
		if (options.length > 0) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			this.popoverEl.appendChild(row);

			select = document.createElement('select');
			select.className = 'reveal-select';
			for (const optionValue of options) {
				const option = document.createElement('option');
				option.value = optionValue;
				option.textContent = optionValue;
				select.appendChild(option);
			}

			if (options.includes(normalized)) {
				select.value = normalized;
			}

			row.appendChild(select);
		}

		const inputRow = document.createElement('div');
		inputRow.className = 'reveal-popover-row';
		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'reveal-text-input';
		input.value = normalized;
		inputRow.appendChild(input);
		this.popoverEl.appendChild(inputRow);

		const applyValue = (nextValue: string) => {
			const formatted = prop === 'font-family' ? this.formatFontFamily(nextValue) : nextValue;
			this.applyTokenReplacement(formatted);
		};

		if (select) {
			select.addEventListener('change', () => {
				input.value = select?.value ?? '';
				applyValue(select?.value ?? '');
			});
		}

		input.addEventListener('change', () => {
			applyValue(input.value.trim());
		});
	}

	private getEnumOptions(prop: string | null): string[] {
		switch (prop) {
			case 'display':
				return ['none', 'block', 'inline', 'inline-block', 'flex', 'grid', 'inline-flex', 'contents'];
			case 'position':
				return ['static', 'relative', 'absolute', 'fixed', 'sticky'];
			case 'overflow':
			case 'overflow-x':
			case 'overflow-y':
				return ['visible', 'hidden', 'scroll', 'auto', 'clip'];
			case 'visibility':
				return ['visible', 'hidden', 'collapse'];
			case 'pointer-events':
				return ['auto', 'none'];
			case 'cursor':
				return [
					'auto',
					'default',
					'pointer',
					'move',
					'text',
					'grab',
					'grabbing',
					'not-allowed',
					'crosshair',
					'zoom-in',
					'zoom-out',
					'ew-resize',
					'ns-resize',
					'nesw-resize',
					'nwse-resize',
					'col-resize',
					'row-resize'
				];
			case 'flex-direction':
				return ['row', 'row-reverse', 'column', 'column-reverse'];
			case 'justify-content':
				return ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
			case 'justify-items':
				return ['stretch', 'start', 'center', 'end'];
			case 'justify-self':
				return ['auto', 'stretch', 'start', 'center', 'end', 'self-start', 'self-end'];
			case 'align-items':
				return ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'];
			case 'align-content':
				return ['stretch', 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
			case 'align-self':
				return ['auto', 'stretch', 'flex-start', 'center', 'flex-end', 'baseline'];
			case 'flex-wrap':
				return ['nowrap', 'wrap', 'wrap-reverse'];
			case 'text-transform':
				return ['none', 'uppercase', 'lowercase', 'capitalize'];
			case 'text-align':
				return ['left', 'center', 'right', 'justify', 'start', 'end'];
			case 'text-decoration':
			case 'text-decoration-line':
				return ['none', 'underline', 'overline', 'line-through'];
			case 'font-style':
				return ['normal', 'italic', 'oblique'];
			case 'font-variant':
				return ['normal', 'small-caps'];
			case 'font-stretch':
				return [
					'normal',
					'condensed',
					'expanded',
					'ultra-condensed',
					'extra-condensed',
					'semi-condensed',
					'semi-expanded',
					'extra-expanded',
					'ultra-expanded'
				];
			case 'font-family':
				return [
					'JetBrains Mono',
					'Cinzel',
					'Fira Code',
					'Source Code Pro',
					'IBM Plex Mono',
					'Inter',
					'Roboto',
					'Arial',
					'Helvetica',
					'Courier New',
					'Georgia',
					'Times New Roman',
					'Verdana',
					'Tahoma'
				];
			case 'font-weight':
				return ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'bolder', 'lighter'];
			case 'white-space':
				return ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces'];
			case 'word-break':
				return ['normal', 'break-all', 'keep-all', 'break-word'];
			case 'background-repeat':
				return ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'];
			case 'background-size':
				return ['auto', 'cover', 'contain'];
			case 'background-attachment':
				return ['scroll', 'fixed', 'local'];
			case 'background-clip':
				return ['border-box', 'padding-box', 'content-box', 'text'];
			case 'background-origin':
				return ['padding-box', 'border-box', 'content-box'];
			case 'border-style':
				return ['none', 'hidden', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
			case 'object-fit':
				return ['fill', 'contain', 'cover', 'none', 'scale-down'];
			case 'animation':
			case 'animation-name': {
				const names = this.keyframeNames.length > 0 ? this.keyframeNames : [];
				return ['none', ...names];
			}
			case 'animation-timing-function':
				return ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end', 'steps(2)', 'steps(4)', 'cubic-bezier(0.4, 0, 0.2, 1)'];
			case 'animation-direction':
				return ['normal', 'reverse', 'alternate', 'alternate-reverse'];
			case 'animation-fill-mode':
				return ['none', 'forwards', 'backwards', 'both'];
			case 'animation-play-state':
				return ['running', 'paused'];
			case 'animation-iteration-count':
				return ['infinite', '1', '2', '3', '4', '5'];
			default:
				return [];
		}
	}

	private normalizeFontFamily(value: string): string {
		return value.replace(/^['"]|['"]$/g, '');
	}

	private formatFontFamily(value: string): string {
		const cleaned = value.trim().replace(/^['"]|['"]$/g, '');
		if (cleaned.includes(',') || cleaned.includes('var(')) return cleaned;
		if (cleaned.includes(' ')) return `'${cleaned}'`;
		return cleaned;
	}

	private extractKeyframeNames(text: string): string[] {
		const names: string[] = [];
		const regex = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			names.push(match[1]);
		}
		return Array.from(new Set(names));
	}

	private buildNumberPopover(value: string, prop: string | null) {
		if (!this.popoverEl) return;
		const parsed = this.parseNumberToken(value);
		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = tr(this.app, 'value');
		this.popoverEl.appendChild(title);

		if (!parsed) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'reveal-text-input';
			input.value = value;
			row.appendChild(input);
			this.popoverEl.appendChild(row);
			input.addEventListener('change', () => this.applyTokenReplacement(input.value.trim()));
			return;
		}

		const { num, unit, decimals } = parsed;
		const sliderConfig = this.getSliderConfig(unit, num, prop);

		const row = document.createElement('div');
		row.className = 'reveal-popover-row';
		this.popoverEl.appendChild(row);

		const label = document.createElement('div');
		label.className = 'reveal-popover-label';
		label.textContent = unit || prop || '';
		row.appendChild(label);

		const range = document.createElement('input');
		range.type = 'range';
		range.className = 'reveal-range';
		range.min = String(sliderConfig.min);
		range.max = String(sliderConfig.max);
		range.step = String(sliderConfig.step);
		range.value = String(num);
		row.appendChild(range);

		const numberInput = document.createElement('input');
		numberInput.type = 'number';
		numberInput.className = 'reveal-number-input';
		numberInput.min = String(sliderConfig.min);
		numberInput.max = String(sliderConfig.max);
		numberInput.step = String(sliderConfig.step);
		numberInput.value = String(num);
		row.appendChild(numberInput);

		const applyNumber = (next: number) => {
			const fixed = decimals > 0 ? next.toFixed(decimals) : String(Math.round(next));
			this.applyTokenReplacement(`${fixed}${unit}`);
		};

		if (prop === 'font-weight') {
			const weightRow = document.createElement('div');
			weightRow.className = 'reveal-popover-row';
			const weightLabel = document.createElement('div');
			weightLabel.className = 'reveal-popover-label';
			weightLabel.textContent = tr(this.app, 'weight');
			weightRow.appendChild(weightLabel);

			const weightSelect = document.createElement('select');
			weightSelect.className = 'reveal-select';
			const weights = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'bolder', 'lighter'];
			for (const weight of weights) {
				const option = document.createElement('option');
				option.value = weight;
				option.textContent = weight;
				weightSelect.appendChild(option);
			}
			weightSelect.value = weights.includes(value) ? value : String(num);
			weightSelect.addEventListener('change', () => {
				const selected = weightSelect.value;
				const numeric = parseFloat(selected);
				if (!Number.isNaN(numeric)) {
					range.value = selected;
					numberInput.value = selected;
				}
				this.applyTokenReplacement(selected);
			});
			weightRow.appendChild(weightSelect);
			this.popoverEl.appendChild(weightRow);
		}

		range.addEventListener('input', () => {
			const next = parseFloat(range.value);
			numberInput.value = range.value;
			applyNumber(next);
		});

		numberInput.addEventListener('input', () => {
			const next = parseFloat(numberInput.value);
			if (Number.isNaN(next)) return;
			range.value = String(next);
			applyNumber(next);
		});
	}

	private buildTransformPopover(value: string) {
		if (!this.popoverEl) return;
		const resolvedValue = this.resolveVariableValue(value, new Set<string>()) ?? value;
		const parsed = this.parseTransform(resolvedValue);
		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = tr(this.app, 'transform');
		this.popoverEl.appendChild(title);

		if (!parsed) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'reveal-text-input';
			input.value = value;
			row.appendChild(input);
			this.popoverEl.appendChild(row);
			input.addEventListener('change', () => this.applyTokenReplacement(input.value.trim()));
			return;
		}

		const applyTransform = () => {
			const nextValue = this.buildTransformValue(parsed);
			this.applyTokenReplacement(nextValue);
		};

		const createTransformRow = (
			label: string,
			getValue: () => TransformValue | { num: number; unit: string },
			setValue: (next: TransformValue) => void,
			activeKey: keyof ParsedTransform['active'],
			kind: 'translate' | 'rotate' | 'skew' | 'perspective',
			units?: string[]
		) => {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';

			const toggle = document.createElement('input');
			toggle.type = 'checkbox';
			toggle.className = 'reveal-toggle';
			toggle.checked = parsed.active[activeKey];
			row.appendChild(toggle);

			const labelEl = document.createElement('div');
			labelEl.className = 'reveal-popover-label';
			labelEl.textContent = label;
			row.appendChild(labelEl);

			const range = document.createElement('input');
			range.type = 'range';
			range.className = 'reveal-range';
			row.appendChild(range);

			const numberInput = document.createElement('input');
			numberInput.type = 'number';
			numberInput.className = 'reveal-number-input';
			row.appendChild(numberInput);

			const unitSelect = document.createElement('select');
			unitSelect.className = 'reveal-select';
			const unitOptions =
				units ??
				(kind === 'rotate' || kind === 'skew'
					? ['deg', 'rad', 'turn']
					: ['px', '%', 'vw', 'vh', 'rem', 'em']);
			for (const optionValue of unitOptions) {
				const option = document.createElement('option');
				option.value = optionValue;
				option.textContent = optionValue;
				unitSelect.appendChild(option);
			}
			row.appendChild(unitSelect);

			const syncControls = () => {
				const current = getValue();
				const config = this.getTransformSliderConfig(kind, current.unit);
				const min = Math.min(config.min, current.num);
				const max = Math.max(config.max, current.num);
				range.min = String(min);
				range.max = String(max);
				range.step = String(config.step);
				range.value = String(current.num);
				numberInput.min = String(min);
				numberInput.max = String(max);
				numberInput.step = String(config.step);
				numberInput.value = String(current.num);
				unitSelect.value = current.unit;
			};

			const updateEnabled = () => {
				const enabled = parsed.active[activeKey];
				range.disabled = !enabled;
				numberInput.disabled = !enabled;
				unitSelect.disabled = !enabled;
			};

			syncControls();
			updateEnabled();

			toggle.addEventListener('change', () => {
				parsed.active[activeKey] = toggle.checked;
				updateEnabled();
				applyTransform();
			});

			range.addEventListener('input', () => {
				const current = getValue();
				current.num = parseFloat(range.value);
				setValue(current);
				numberInput.value = range.value;
				parsed.active[activeKey] = true;
				toggle.checked = true;
				updateEnabled();
				applyTransform();
			});

			numberInput.addEventListener('input', () => {
				const next = parseFloat(numberInput.value);
				if (Number.isNaN(next)) return;
				const current = getValue();
				current.num = next;
				setValue(current);
				range.value = numberInput.value;
				parsed.active[activeKey] = true;
				toggle.checked = true;
				updateEnabled();
				applyTransform();
			});

			unitSelect.addEventListener('change', () => {
				const current = getValue();
				current.unit = unitSelect.value;
				setValue(current);
				syncControls();
				parsed.active[activeKey] = true;
				toggle.checked = true;
				updateEnabled();
				applyTransform();
			});

			this.popoverEl?.appendChild(row);
		};

		const createScaleRow = (
			label: string,
			getValue: () => number,
			setValue: (next: number) => void,
			activeKey: keyof ParsedTransform['active']
		) => {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';

			const toggle = document.createElement('input');
			toggle.type = 'checkbox';
			toggle.className = 'reveal-toggle';
			toggle.checked = parsed.active[activeKey];
			row.appendChild(toggle);

			const labelEl = document.createElement('div');
			labelEl.className = 'reveal-popover-label';
			labelEl.textContent = label;
			row.appendChild(labelEl);

			const range = document.createElement('input');
			range.type = 'range';
			range.className = 'reveal-range';
			const config = this.getTransformSliderConfig('scale', '');
			range.min = String(config.min);
			range.max = String(config.max);
			range.step = String(config.step);
			range.value = String(getValue());
			row.appendChild(range);

			const numberInput = document.createElement('input');
			numberInput.type = 'number';
			numberInput.className = 'reveal-number-input';
			numberInput.min = String(config.min);
			numberInput.max = String(config.max);
			numberInput.step = String(config.step);
			numberInput.value = String(getValue());
			row.appendChild(numberInput);

			const updateEnabled = () => {
				const enabled = parsed.active[activeKey];
				range.disabled = !enabled;
				numberInput.disabled = !enabled;
			};
			updateEnabled();

			toggle.addEventListener('change', () => {
				parsed.active[activeKey] = toggle.checked;
				updateEnabled();
				applyTransform();
			});

			range.addEventListener('input', () => {
				const next = parseFloat(range.value);
				setValue(next);
				numberInput.value = range.value;
				parsed.active[activeKey] = true;
				toggle.checked = true;
				updateEnabled();
				applyTransform();
			});

			numberInput.addEventListener('input', () => {
				const next = parseFloat(numberInput.value);
				if (Number.isNaN(next)) return;
				setValue(next);
				range.value = numberInput.value;
				parsed.active[activeKey] = true;
				toggle.checked = true;
				updateEnabled();
				applyTransform();
			});

			this.popoverEl?.appendChild(row);
		};

		createTransformRow(
			tr(this.app, 'translateX'),
			() => parsed.translateX,
			(next) => (parsed.translateX = next),
			'translateX',
			'translate'
		);
		createTransformRow(
			tr(this.app, 'translateY'),
			() => parsed.translateY,
			(next) => (parsed.translateY = next),
			'translateY',
			'translate'
		);
		createTransformRow(
			tr(this.app, 'translateZ'),
			() => parsed.translateZ,
			(next) => (parsed.translateZ = next),
			'translateZ',
			'translate'
		);
		createTransformRow(
			tr(this.app, 'rotate'),
			() => parsed.rotate,
			(next) => (parsed.rotate = next),
			'rotate',
			'rotate'
		);
		createTransformRow(
			tr(this.app, 'rotateX'),
			() => parsed.rotateX,
			(next) => (parsed.rotateX = next),
			'rotateX',
			'rotate'
		);
		createTransformRow(
			tr(this.app, 'rotateY'),
			() => parsed.rotateY,
			(next) => (parsed.rotateY = next),
			'rotateY',
			'rotate'
		);
		createTransformRow(
			tr(this.app, 'skewX'),
			() => parsed.skewX,
			(next) => (parsed.skewX = next),
			'skewX',
			'skew'
		);
		createTransformRow(
			tr(this.app, 'skewY'),
			() => parsed.skewY,
			(next) => (parsed.skewY = next),
			'skewY',
			'skew'
		);
		createScaleRow(tr(this.app, 'scaleX'), () => parsed.scaleX, (next) => (parsed.scaleX = next), 'scaleX');
		createScaleRow(tr(this.app, 'scaleY'), () => parsed.scaleY, (next) => (parsed.scaleY = next), 'scaleY');
		createScaleRow(tr(this.app, 'scaleZ'), () => parsed.scaleZ, (next) => (parsed.scaleZ = next), 'scaleZ');
		createTransformRow(
			tr(this.app, 'perspective'),
			() => parsed.perspective,
			(next) => (parsed.perspective = next),
			'perspective',
			'perspective',
			['px', 'rem', 'em', 'vw', 'vh']
		);
	}

	private buildShadowPopover(value: string, prop: string | null) {
		if (!this.popoverEl) return;
		const isBoxShadow = prop === 'box-shadow';
		const resolvedValue = this.resolveVariableValue(value, new Set<string>()) ?? value;
		const shadows = this.parseShadowList(resolvedValue, isBoxShadow);
		const title = document.createElement('div');
		title.className = 'reveal-popover-title';
		title.textContent = isBoxShadow ? tr(this.app, 'boxShadow') : tr(this.app, 'textShadow');
		this.popoverEl.appendChild(title);

		if (shadows.length === 0) {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'reveal-text-input';
			input.value = value;
			row.appendChild(input);
			this.popoverEl.appendChild(row);
			input.addEventListener('change', () => this.applyTokenReplacement(input.value.trim()));
			return;
		}

		if (this.activeShadowIndex >= shadows.length) {
			this.activeShadowIndex = 0;
		}

		const listRow = document.createElement('div');
		listRow.className = 'reveal-popover-row';
		const listLabel = document.createElement('div');
		listLabel.className = 'reveal-popover-label';
		listLabel.textContent = tr(this.app, 'shadows');
		listRow.appendChild(listLabel);
		this.popoverEl.appendChild(listRow);

		const list = document.createElement('div');
		list.className = 'reveal-shadow-list';
		this.popoverEl.appendChild(list);

		const rebuild = () => {
			this.popoverEl!.innerHTML = '';
			this.buildShadowPopover(this.activeTokenValue ?? value, prop);
			this.positionPopover();
		};

		const applyShadow = () => {
			const nextValue = this.buildShadowValue(shadows, isBoxShadow);
			this.applyTokenReplacement(nextValue);
		};

		const createShadowLabel = (shadow: ParsedShadow) => {
			const x = this.formatShadowLength(shadow.x);
			const y = this.formatShadowLength(shadow.y);
			const blur = this.formatShadowLength(shadow.blur);
			const spread = isBoxShadow ? ` ${this.formatShadowLength(shadow.spread)}` : '';
			return `${x} ${y} ${blur}${spread}`;
		};

		shadows.forEach((shadow, index) => {
			const item = document.createElement('div');
			item.className = 'reveal-shadow-item';

			const selectBtn = document.createElement('button');
			selectBtn.type = 'button';
			selectBtn.className = 'reveal-shadow-chip';
			selectBtn.textContent = `#${index + 1}`;
			if (index === this.activeShadowIndex) selectBtn.addClass('is-active');
			selectBtn.addEventListener('click', () => {
				this.activeShadowIndex = index;
				rebuild();
			});
			item.appendChild(selectBtn);

			const summary = document.createElement('div');
			summary.className = 'reveal-shadow-summary';
			summary.textContent = createShadowLabel(shadow);
			item.appendChild(summary);

			const removeBtn = document.createElement('button');
			removeBtn.type = 'button';
			removeBtn.className = 'reveal-shadow-remove';
			removeBtn.textContent = tr(this.app, 'remove');
			removeBtn.addEventListener('click', () => {
				shadows.splice(index, 1);
				if (shadows.length === 0) {
					this.activeShadowIndex = 0;
					this.applyTokenReplacement('none');
					rebuild();
					return;
				}
				if (this.activeShadowIndex >= shadows.length) {
					this.activeShadowIndex = shadows.length - 1;
				}
				applyShadow();
				rebuild();
			});
			item.appendChild(removeBtn);

			list.appendChild(item);
		});

		const addRow = document.createElement('div');
		addRow.className = 'reveal-popover-row';
		const addButton = document.createElement('button');
		addButton.type = 'button';
		addButton.className = 'reveal-button';
		addButton.textContent = tr(this.app, 'addShadow');
		addButton.addEventListener('click', () => {
			const nextShadow: ParsedShadow = {
				inset: false,
				x: { num: 0, unit: 'px' },
				y: { num: 0, unit: 'px' },
				blur: { num: isBoxShadow ? 12 : 6, unit: 'px' },
				spread: { num: 0, unit: 'px' },
				color: 'rgba(0, 0, 0, 0.35)',
				raw: ''
			};
			shadows.push(nextShadow);
			this.activeShadowIndex = shadows.length - 1;
			applyShadow();
			rebuild();
		});
		addRow.appendChild(addButton);
		this.popoverEl.appendChild(addRow);

		const shadow = shadows[this.activeShadowIndex];

		if (isBoxShadow) {
			const insetRow = document.createElement('div');
			insetRow.className = 'reveal-popover-row';
			const insetLabel = document.createElement('div');
			insetLabel.className = 'reveal-popover-label';
			insetLabel.textContent = tr(this.app, 'inset');
			insetRow.appendChild(insetLabel);
			const insetToggle = document.createElement('input');
			insetToggle.type = 'checkbox';
			insetToggle.className = 'reveal-toggle';
			insetToggle.checked = shadow.inset;
			insetToggle.addEventListener('change', () => {
				shadow.inset = insetToggle.checked;
				applyShadow();
			});
			insetRow.appendChild(insetToggle);
			this.popoverEl.appendChild(insetRow);
		}

		const createShadowLengthRow = (
			label: string,
			getValue: () => ShadowValue,
			setValue: (next: ShadowValue) => void,
			allowNegative: boolean
		) => {
			const row = document.createElement('div');
			row.className = 'reveal-popover-row';
			const labelEl = document.createElement('div');
			labelEl.className = 'reveal-popover-label';
			labelEl.textContent = label;
			row.appendChild(labelEl);

			const range = document.createElement('input');
			range.type = 'range';
			range.className = 'reveal-range';
			row.appendChild(range);

			const numberInput = document.createElement('input');
			numberInput.type = 'number';
			numberInput.className = 'reveal-number-input';
			row.appendChild(numberInput);

			const unitSelect = document.createElement('select');
			unitSelect.className = 'reveal-select';
			const unitOptions = ['px', 'rem', 'em', '%'];
			for (const optionValue of unitOptions) {
				const option = document.createElement('option');
				option.value = optionValue;
				option.textContent = optionValue;
				unitSelect.appendChild(option);
			}
			row.appendChild(unitSelect);

			const syncControls = () => {
				const current = getValue();
				const config = this.getShadowSliderConfig(current.unit, allowNegative);
				const min = Math.min(config.min, current.num);
				const max = Math.max(config.max, current.num);
				range.min = String(min);
				range.max = String(max);
				range.step = String(config.step);
				range.value = String(current.num);
				numberInput.min = String(min);
				numberInput.max = String(max);
				numberInput.step = String(config.step);
				numberInput.value = String(current.num);
				unitSelect.value = current.unit;
			};

			syncControls();

			range.addEventListener('input', () => {
				const current = getValue();
				current.num = parseFloat(range.value);
				setValue(current);
				numberInput.value = range.value;
				applyShadow();
			});

			numberInput.addEventListener('input', () => {
				const next = parseFloat(numberInput.value);
				if (Number.isNaN(next)) return;
				const current = getValue();
				current.num = next;
				setValue(current);
				range.value = numberInput.value;
				applyShadow();
			});

			unitSelect.addEventListener('change', () => {
				const current = getValue();
				current.unit = unitSelect.value;
				setValue(current);
				syncControls();
				applyShadow();
			});

			this.popoverEl?.appendChild(row);
		};

		createShadowLengthRow(tr(this.app, 'x'), () => shadow.x, (next) => (shadow.x = next), true);
		createShadowLengthRow(tr(this.app, 'y'), () => shadow.y, (next) => (shadow.y = next), true);
		createShadowLengthRow(tr(this.app, 'blur'), () => shadow.blur, (next) => (shadow.blur = next), false);
		if (isBoxShadow) {
			createShadowLengthRow(tr(this.app, 'spread'), () => shadow.spread, (next) => (shadow.spread = next), true);
		}

		const colorRow = document.createElement('div');
		colorRow.className = 'reveal-popover-row';
		const colorLabel = document.createElement('div');
		colorLabel.className = 'reveal-popover-label';
		colorLabel.textContent = tr(this.app, 'colorLabel');
		colorRow.appendChild(colorLabel);

		const colorInput = document.createElement('input');
		colorInput.type = 'color';
		colorInput.className = 'reveal-color-input';
		colorRow.appendChild(colorInput);

		const colorText = document.createElement('input');
		colorText.type = 'text';
		colorText.className = 'reveal-text-input';
		colorText.value = shadow.color ?? '';
		colorRow.appendChild(colorText);
		this.popoverEl.appendChild(colorRow);

		const parsedColor = shadow.color ? this.parseColor(shadow.color) : null;
		if (parsedColor) {
			colorInput.value = this.rgbToHex(parsedColor.r, parsedColor.g, parsedColor.b);
		} else {
			colorInput.disabled = true;
		}

		const applyColor = (nextColor: string) => {
			shadow.color = nextColor;
			applyShadow();
		};

		colorInput.addEventListener('input', () => {
			const nextRgb = this.hexToRgb(colorInput.value);
			if (!nextRgb) return;
			const nextValue = `rgb(${nextRgb.r}, ${nextRgb.g}, ${nextRgb.b})`;
			colorText.value = nextValue;
			applyColor(nextValue);
		});

		colorText.addEventListener('change', () => {
			const next = colorText.value.trim();
			shadow.color = next;
			const parsed = this.parseColor(next);
			if (parsed) {
				colorInput.disabled = false;
				colorInput.value = this.rgbToHex(parsed.r, parsed.g, parsed.b);
			} else {
				colorInput.disabled = true;
			}
			applyShadow();
		});
	}

	private parseTransform(value: string): ParsedTransform | null {
		const items: TransformItem[] = [];
		const regex = /([a-zA-Z0-9_-]+)\(([^)]*)\)/g;
		let match: RegExpExecArray | null;

		const parsed: ParsedTransform = {
			items,
			translateX: { num: 0, unit: 'px' },
			translateY: { num: 0, unit: 'px' },
			translateZ: { num: 0, unit: 'px' },
			rotate: { num: 0, unit: 'deg' },
			rotateX: { num: 0, unit: 'deg' },
			rotateY: { num: 0, unit: 'deg' },
			skewX: { num: 0, unit: 'deg' },
			skewY: { num: 0, unit: 'deg' },
			perspective: { num: 800, unit: 'px' },
			scaleX: 1,
			scaleY: 1,
			scaleZ: 1,
			active: {
				translateX: false,
				translateY: false,
				translateZ: false,
				rotate: false,
				rotateX: false,
				rotateY: false,
				skewX: false,
				skewY: false,
				perspective: false,
				scaleX: false,
				scaleY: false,
				scaleZ: false
			},
			present: {
				translate: false,
				translateX: false,
				translateY: false,
				translateZ: false,
				rotate: false,
				rotateX: false,
				rotateY: false,
				rotateZ: false,
				skew: false,
				skewX: false,
				skewY: false,
				perspective: false,
				scale: false,
				scaleX: false,
				scaleY: false,
				scaleZ: false
			}
		};

		while ((match = regex.exec(value)) !== null) {
			const raw = match[0];
			const name = match[1];
			const lower = name.toLowerCase();
			const args = match[2].trim();
			const tokens = args.length > 0 ? args.split(/[\s,]+/).filter(Boolean) : [];
			let recognized = false;

			if (lower === 'translate') {
				parsed.present.translate = true;
				if (tokens[0]) {
					const parsedX = this.parseNumberToken(tokens[0]);
					if (parsedX) {
						parsed.translateX = { num: parsedX.num, unit: parsedX.unit || 'px' };
						parsed.active.translateX = true;
					}
				}
				if (tokens[1]) {
					const parsedY = this.parseNumberToken(tokens[1]);
					if (parsedY) {
						parsed.translateY = { num: parsedY.num, unit: parsedY.unit || 'px' };
						parsed.active.translateY = true;
					}
				} else if (tokens[0] && parsed.active.translateX) {
					parsed.translateY = { ...parsed.translateX };
					parsed.active.translateY = true;
				}
				recognized = true;
			} else if (lower === 'translatex') {
				parsed.present.translateX = true;
				if (tokens[0]) {
					const parsedX = this.parseNumberToken(tokens[0]);
					if (parsedX) {
						parsed.translateX = { num: parsedX.num, unit: parsedX.unit || 'px' };
						parsed.active.translateX = true;
					}
				}
				recognized = true;
			} else if (lower === 'translatey') {
				parsed.present.translateY = true;
				if (tokens[0]) {
					const parsedY = this.parseNumberToken(tokens[0]);
					if (parsedY) {
						parsed.translateY = { num: parsedY.num, unit: parsedY.unit || 'px' };
						parsed.active.translateY = true;
					}
				}
				recognized = true;
			} else if (lower === 'translatez') {
				parsed.present.translateZ = true;
				if (tokens[0]) {
					const parsedZ = this.parseNumberToken(tokens[0]);
					if (parsedZ) {
						parsed.translateZ = { num: parsedZ.num, unit: parsedZ.unit || 'px' };
						parsed.active.translateZ = true;
					}
				}
				recognized = true;
			} else if (lower === 'rotate' || lower === 'rotatez') {
				if (lower === 'rotate') parsed.present.rotate = true;
				if (lower === 'rotatez') parsed.present.rotateZ = true;
				if (tokens[0]) {
					const parsedRotate = this.parseNumberToken(tokens[0]);
					if (parsedRotate) {
						parsed.rotate = { num: parsedRotate.num, unit: parsedRotate.unit || 'deg' };
						parsed.active.rotate = true;
					}
				}
				recognized = true;
			} else if (lower === 'rotatex') {
				parsed.present.rotateX = true;
				if (tokens[0]) {
					const parsedRotate = this.parseNumberToken(tokens[0]);
					if (parsedRotate) {
						parsed.rotateX = { num: parsedRotate.num, unit: parsedRotate.unit || 'deg' };
						parsed.active.rotateX = true;
					}
				}
				recognized = true;
			} else if (lower === 'rotatey') {
				parsed.present.rotateY = true;
				if (tokens[0]) {
					const parsedRotate = this.parseNumberToken(tokens[0]);
					if (parsedRotate) {
						parsed.rotateY = { num: parsedRotate.num, unit: parsedRotate.unit || 'deg' };
						parsed.active.rotateY = true;
					}
				}
				recognized = true;
			} else if (lower === 'scale') {
				parsed.present.scale = true;
				if (tokens[0]) {
					const sx = parseFloat(tokens[0]);
					if (!Number.isNaN(sx)) {
						parsed.scaleX = sx;
						parsed.active.scaleX = true;
					}
				}
				if (tokens[1]) {
					const sy = parseFloat(tokens[1]);
					if (!Number.isNaN(sy)) {
						parsed.scaleY = sy;
						parsed.active.scaleY = true;
					}
				} else if (tokens[0] && parsed.active.scaleX) {
					parsed.scaleY = parsed.scaleX;
					parsed.active.scaleY = true;
				}
				recognized = true;
			} else if (lower === 'scalez') {
				parsed.present.scaleZ = true;
				if (tokens[0]) {
					const sz = parseFloat(tokens[0]);
					if (!Number.isNaN(sz)) {
						parsed.scaleZ = sz;
						parsed.active.scaleZ = true;
					}
				}
				recognized = true;
			} else if (lower === 'scalex') {
				parsed.present.scaleX = true;
				if (tokens[0]) {
					const sx = parseFloat(tokens[0]);
					if (!Number.isNaN(sx)) {
						parsed.scaleX = sx;
						parsed.active.scaleX = true;
					}
				}
				recognized = true;
			} else if (lower === 'scaley') {
				parsed.present.scaleY = true;
				if (tokens[0]) {
					const sy = parseFloat(tokens[0]);
					if (!Number.isNaN(sy)) {
						parsed.scaleY = sy;
						parsed.active.scaleY = true;
					}
				}
				recognized = true;
			} else if (lower === 'skew') {
				parsed.present.skew = true;
				if (tokens[0]) {
					const parsedX = this.parseNumberToken(tokens[0]);
					if (parsedX) {
						parsed.skewX = { num: parsedX.num, unit: parsedX.unit || 'deg' };
						parsed.active.skewX = true;
					}
				}
				if (tokens[1]) {
					const parsedY = this.parseNumberToken(tokens[1]);
					if (parsedY) {
						parsed.skewY = { num: parsedY.num, unit: parsedY.unit || 'deg' };
						parsed.active.skewY = true;
					}
				} else if (tokens[0] && parsed.active.skewX) {
					parsed.skewY = { ...parsed.skewX };
					parsed.active.skewY = true;
				}
				recognized = true;
			} else if (lower === 'skewx') {
				parsed.present.skewX = true;
				if (tokens[0]) {
					const parsedX = this.parseNumberToken(tokens[0]);
					if (parsedX) {
						parsed.skewX = { num: parsedX.num, unit: parsedX.unit || 'deg' };
						parsed.active.skewX = true;
					}
				}
				recognized = true;
			} else if (lower === 'skewy') {
				parsed.present.skewY = true;
				if (tokens[0]) {
					const parsedY = this.parseNumberToken(tokens[0]);
					if (parsedY) {
						parsed.skewY = { num: parsedY.num, unit: parsedY.unit || 'deg' };
						parsed.active.skewY = true;
					}
				}
				recognized = true;
			} else if (lower === 'perspective') {
				parsed.present.perspective = true;
				if (tokens[0]) {
					const parsedPerspective = this.parseNumberToken(tokens[0]);
					if (parsedPerspective) {
						parsed.perspective = { num: parsedPerspective.num, unit: parsedPerspective.unit || 'px' };
						parsed.active.perspective = true;
					}
				}
				recognized = true;
			}

			items.push({ name, raw, recognized });
		}

		if (items.length === 0) {
			if (value.trim().toLowerCase() === 'none') return parsed;
			return null;
		}
		return parsed;
	}

	private buildTransformValue(parsed: ParsedTransform): string {
		const parts: string[] = [];

		const formatValue = (value: TransformValue, decimals: number) =>
			`${this.formatNumber(value.num, decimals)}${value.unit}`;

		const buildTranslate = () => {
			const activeX = parsed.active.translateX;
			const activeY = parsed.active.translateY;
			if (!activeX && !activeY) return null;
			const xValue = formatValue(parsed.translateX, 2);
			const yValue = formatValue(parsed.translateY, 2);
			if (activeX && activeY) return `translate(${xValue}, ${yValue})`;
			if (activeX) return `translate(${xValue})`;
			return `translate(0${parsed.translateY.unit}, ${yValue})`;
		};

		const buildScale = (preferScale: boolean) => {
			const activeX = parsed.active.scaleX;
			const activeY = parsed.active.scaleY;
			if (!activeX && !activeY) return null;
			const sx = this.formatNumber(parsed.scaleX, 2);
			const sy = this.formatNumber(parsed.scaleY, 2);
			if (preferScale) {
				if (activeX && activeY && sx === sy) return `scale(${sx})`;
				if (activeX && activeY) return `scale(${sx}, ${sy})`;
				if (activeX) return `scale(${sx})`;
				return `scale(1, ${sy})`;
			}
			if (activeX) parts.push(`scaleX(${sx})`);
			if (activeY) parts.push(`scaleY(${sy})`);
			return null;
		};

		const buildSkew = () => {
			const activeX = parsed.active.skewX;
			const activeY = parsed.active.skewY;
			if (!activeX && !activeY) return null;
			const xValue = formatValue(parsed.skewX, 1);
			const yValue = formatValue(parsed.skewY, 1);
			if (activeX && activeY) return `skew(${xValue}, ${yValue})`;
			if (activeX) return `skew(${xValue})`;
			return `skew(0${parsed.skewY.unit}, ${yValue})`;
		};

		for (const item of parsed.items) {
			const lower = item.name.toLowerCase();
			if (!item.recognized) {
				parts.push(item.raw);
				continue;
			}

			if (lower === 'translate') {
				const next = buildTranslate();
				if (next) parts.push(next);
				continue;
			}
			if (lower === 'translatex') {
				if (parsed.active.translateX) {
					parts.push(`translateX(${formatValue(parsed.translateX, 2)})`);
				}
				continue;
			}
			if (lower === 'translatey') {
				if (parsed.active.translateY) {
					parts.push(`translateY(${formatValue(parsed.translateY, 2)})`);
				}
				continue;
			}
			if (lower === 'translatez') {
				if (parsed.active.translateZ) {
					parts.push(`translateZ(${formatValue(parsed.translateZ, 2)})`);
				}
				continue;
			}
			if (lower === 'rotate' || lower === 'rotatez') {
				if (parsed.active.rotate) {
					parts.push(`rotate(${formatValue(parsed.rotate, 1)})`);
				}
				continue;
			}
			if (lower === 'rotatex') {
				if (parsed.active.rotateX) {
					parts.push(`rotateX(${formatValue(parsed.rotateX, 1)})`);
				}
				continue;
			}
			if (lower === 'rotatey') {
				if (parsed.active.rotateY) {
					parts.push(`rotateY(${formatValue(parsed.rotateY, 1)})`);
				}
				continue;
			}
			if (lower === 'scale') {
				const next = buildScale(true);
				if (next) parts.push(next);
				continue;
			}
			if (lower === 'scalex') {
				if (parsed.active.scaleX) {
					parts.push(`scaleX(${this.formatNumber(parsed.scaleX, 2)})`);
				}
				continue;
			}
			if (lower === 'scaley') {
				if (parsed.active.scaleY) {
					parts.push(`scaleY(${this.formatNumber(parsed.scaleY, 2)})`);
				}
				continue;
			}
			if (lower === 'scalez') {
				if (parsed.active.scaleZ) {
					parts.push(`scaleZ(${this.formatNumber(parsed.scaleZ, 2)})`);
				}
				continue;
			}
			if (lower === 'skew') {
				const next = buildSkew();
				if (next) parts.push(next);
				continue;
			}
			if (lower === 'skewx') {
				if (parsed.active.skewX) {
					parts.push(`skewX(${formatValue(parsed.skewX, 1)})`);
				}
				continue;
			}
			if (lower === 'skewy') {
				if (parsed.active.skewY) {
					parts.push(`skewY(${formatValue(parsed.skewY, 1)})`);
				}
				continue;
			}
			if (lower === 'perspective') {
				if (parsed.active.perspective) {
					parts.push(`perspective(${formatValue(parsed.perspective, 0)})`);
				}
				continue;
			}
		}

		const hasTranslate = parsed.present.translate || parsed.present.translateX || parsed.present.translateY;
		if (!hasTranslate && (parsed.active.translateX || parsed.active.translateY)) {
			const next = buildTranslate();
			if (next) parts.push(next);
		}
		if (!parsed.present.translateZ && parsed.active.translateZ) {
			parts.push(`translateZ(${formatValue(parsed.translateZ, 2)})`);
		}
		if (!parsed.present.rotate && !parsed.present.rotateZ && parsed.active.rotate) {
			parts.push(`rotate(${formatValue(parsed.rotate, 1)})`);
		}
		if (!parsed.present.rotateX && parsed.active.rotateX) {
			parts.push(`rotateX(${formatValue(parsed.rotateX, 1)})`);
		}
		if (!parsed.present.rotateY && parsed.active.rotateY) {
			parts.push(`rotateY(${formatValue(parsed.rotateY, 1)})`);
		}
		const hasSkew = parsed.present.skew || parsed.present.skewX || parsed.present.skewY;
		if (!hasSkew && (parsed.active.skewX || parsed.active.skewY)) {
			const next = buildSkew();
			if (next) parts.push(next);
		}
		const hasScale = parsed.present.scale || parsed.present.scaleX || parsed.present.scaleY;
		if (!hasScale && (parsed.active.scaleX || parsed.active.scaleY)) {
			const activeX = parsed.active.scaleX;
			const activeY = parsed.active.scaleY;
			const sx = this.formatNumber(parsed.scaleX, 2);
			const sy = this.formatNumber(parsed.scaleY, 2);
			if (activeX && activeY && sx === sy) {
				parts.push(`scale(${sx})`);
			} else if (activeX && activeY) {
				parts.push(`scale(${sx}, ${sy})`);
			} else if (activeX) {
				parts.push(`scale(${sx})`);
			} else {
				parts.push(`scaleY(${sy})`);
			}
		}
		if (!parsed.present.scaleZ && parsed.active.scaleZ) {
			parts.push(`scaleZ(${this.formatNumber(parsed.scaleZ, 2)})`);
		}
		if (!parsed.present.perspective && parsed.active.perspective) {
			parts.push(`perspective(${formatValue(parsed.perspective, 0)})`);
		}

		return parts.length > 0 ? parts.join(' ') : 'none';
	}

	private getTransformSliderConfig(
		kind: 'translate' | 'rotate' | 'scale' | 'skew' | 'perspective',
		unit: string
	): { min: number; max: number; step: number } {
		if (kind === 'scale') {
			return { min: 0, max: 3, step: 0.01 };
		}
		if (kind === 'rotate' || kind === 'skew') {
			if (unit === 'rad') return { min: -3.14, max: 3.14, step: 0.01 };
			if (unit === 'turn') return { min: -0.25, max: 0.25, step: 0.01 };
			return { min: -90, max: 90, step: 1 };
		}
		if (kind === 'perspective') {
			return { min: 0, max: 2000, step: 10 };
		}
		if (unit === '%') return { min: -50, max: 50, step: 1 };
		if (unit === 'vw' || unit === 'vh') return { min: -100, max: 100, step: 1 };
		if (unit === 'rem' || unit === 'em') return { min: -10, max: 10, step: 0.1 };
		return { min: -400, max: 400, step: 1 };
	}

	private formatNumber(value: number, decimals: number): string {
		const fixed = value.toFixed(decimals);
		return fixed.replace(/\.?0+$/, '');
	}

	private parseShadowList(value: string, isBoxShadow: boolean): ParsedShadow[] {
		if (value.trim().toLowerCase() === 'none') return [];
		const parts = this.splitTopLevelArgs(value);
		const shadows: ParsedShadow[] = [];
		for (const part of parts) {
			const parsed = this.parseShadowPart(part.trim(), isBoxShadow);
			if (parsed) shadows.push(parsed);
		}
		return shadows;
	}

	private parseShadowPart(part: string, isBoxShadow: boolean): ParsedShadow | null {
		if (!part) return null;
		const colorRegex = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b|\bcurrentcolor\b|var\(--[a-z0-9-_]+(?:\s*,\s*[^)]+)?\)/gi;
		let color: string | null = null;
		let colorStart = -1;
		let colorEnd = -1;
		let match: RegExpExecArray | null;
		while ((match = colorRegex.exec(part)) !== null) {
			color = match[0];
			colorStart = match.index;
			colorEnd = match.index + match[0].length;
		}

		let working = part;
		if (color && colorStart >= 0) {
			working = part.slice(0, colorStart) + part.slice(colorEnd);
		}

		let inset = false;
		if (/\binset\b/i.test(working)) {
			inset = true;
			working = working.replace(/\binset\b/gi, ' ');
		}

		const tokens = working.trim().split(/\s+/).filter(Boolean);
		const x = this.parseShadowLength(tokens[0], 'px');
		const y = this.parseShadowLength(tokens[1], 'px');
		const blur = this.parseShadowLength(tokens[2], 'px');
		const spread = this.parseShadowLength(tokens[3], 'px');

		return {
			inset,
			x,
			y,
			blur,
			spread,
			color,
			raw: part
		};
	}

	private parseShadowLength(token: string | undefined, fallbackUnit: string): ShadowValue {
		if (!token) return { num: 0, unit: fallbackUnit };
		const parsed = this.parseNumberToken(token);
		if (!parsed) return { num: 0, unit: fallbackUnit };
		return { num: parsed.num, unit: parsed.unit || fallbackUnit };
	}

	private buildShadowValue(shadows: ParsedShadow[], isBoxShadow: boolean): string {
		const parts = shadows.map((shadow) => {
			const segments: string[] = [];
			if (isBoxShadow && shadow.inset) segments.push('inset');
			segments.push(this.formatShadowLength(shadow.x));
			segments.push(this.formatShadowLength(shadow.y));
			if (shadow.blur) segments.push(this.formatShadowLength(shadow.blur));
			if (isBoxShadow) segments.push(this.formatShadowLength(shadow.spread));
			if (shadow.color) segments.push(shadow.color);
			return segments.join(' ');
		});
		return parts.join(', ');
	}

	private formatShadowLength(value: ShadowValue): string {
		return `${this.formatNumber(value.num, 2)}${value.unit}`;
	}

	private getShadowSliderConfig(unit: string, allowNegative: boolean): { min: number; max: number; step: number } {
		let min = allowNegative ? -200 : 0;
		let max = 200;
		let step = 1;
		if (unit === '%' || unit === 'vw' || unit === 'vh') {
			min = allowNegative ? -100 : 0;
			max = 100;
		}
		if (unit === 'rem' || unit === 'em') {
			min = allowNegative ? -10 : 0;
			max = 10;
			step = 0.1;
		}
		return { min, max, step };
	}

	private parseNumberToken(value: string): { num: number; unit: string; decimals: number } | null {
		const match = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
		if (!match) return null;
		const decimals = (match[1].split('.')[1] || '').length;
		return { num: parseFloat(match[1]), unit: match[2], decimals };
	}

	private getSliderConfig(unit: string, value: number, prop: string | null): { min: number; max: number; step: number } {
		let min = 0;
		let max = 100;
		let step = 1;
		const lowerProp = prop ? prop.toLowerCase() : '';
		if (lowerProp === 'opacity') {
			min = 0;
			max = 1;
			step = 0.01;
		}
		if (lowerProp === 'z-index') {
			min = -9999;
			max = 9999;
			step = 1;
		}
		if (lowerProp === 'line-height') {
			min = 0;
			max = 3;
			step = 0.05;
		}
		if (lowerProp === 'font-weight') {
			min = 100;
			max = 900;
			step = 100;
		}
		if (lowerProp.startsWith('border')) {
			min = 0;
			max = 20;
			step = 1;
		}
		if (lowerProp === 'background-position') {
			min = -100;
			max = 100;
			step = 1;
		}
		if (lowerProp === 'animation-iteration-count') {
			min = 0;
			max = 10;
			step = 1;
		}
		if (lowerProp === 'font-size') {
			min = 8;
			max = 96;
			step = 1;
		}
		if (
			['top', 'left', 'right', 'bottom'].includes(lowerProp) ||
			lowerProp.startsWith('margin')
		) {
			min = -200;
			max = 200;
			step = 1;
		}
		if (lowerProp.startsWith('padding')) {
			min = 0;
			max = 200;
			step = 1;
		}
		if (
			['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height'].includes(lowerProp)
		) {
			min = 0;
			max = 100;
			step = 1;
		}
		if (lowerProp === 'letter-spacing') {
			min = -2;
			max = 10;
			step = 0.1;
		}
		if (lowerProp.includes('radius')) {
			min = 0;
			max = 100;
			step = 1;
		}

		if (unit) {
			switch (unit) {
				case 'px':
					if (
						['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height'].includes(lowerProp)
					) {
						min = 0;
						max = 1000;
					} else if (['top', 'left', 'right', 'bottom'].includes(lowerProp)) {
						min = -400;
						max = 400;
					} else {
						min = min ?? 0;
						max = Math.max(max, 200);
					}
					step = 1;
					break;
				case 'rem':
				case 'em':
				case 'fr':
					min = 0;
					max = 10;
					step = 0.1;
					break;
				case '%':
					if (
						['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height'].includes(lowerProp)
					) {
						min = 0;
						max = 100;
					} else {
						min = -50;
						max = 50;
					}
					step = 1;
					break;
				case 'vh':
				case 'vw':
				case 'vmin':
				case 'vmax':
					min = 0;
					max = 100;
					step = 1;
					break;
				case 'deg':
					min = 0;
					max = 360;
					step = 1;
					break;
				case 's':
					min = 0;
					max = 10;
					step = 0.1;
					break;
				case 'ms':
					min = 0;
					max = 2000;
					step = 10;
					break;
				default:
					min = 0;
					max = 100;
					step = 1;
			}
		}

		min = Math.min(min, value);
		max = Math.max(max, value);
		return { min, max, step };
	}

	private applyTokenReplacement(nextValue: string) {
		if (!this.activeTokenRange) return;
		const { start, end } = this.activeTokenRange;
		this.undoStack.push(this.currentText);
		this.redoStack = [];
		this.currentText = this.currentText.slice(0, start) + nextValue + this.currentText.slice(end);
		this.activeTokenRange = { start, end: start + nextValue.length };
		this.activeTokenValue = nextValue;
		this.lastRecordedText = this.currentText;
		this.isDirty = true;
		this.updateHeader();
		this.updateUndoButtons();
		this.keyframeNames = this.extractKeyframeNames(this.currentText);
		this.scheduleLiveSave();
		this.renderHighlighted(this.currentText, false);
		this.positionPopover();
	}

	private scheduleHidePopover() {
		if (this.hidePopoverTimeout) window.clearTimeout(this.hidePopoverTimeout);
		this.hidePopoverTimeout = window.setTimeout(() => this.hidePopover(), 600);
	}

	private clearHidePopover() {
		if (this.hidePopoverTimeout) window.clearTimeout(this.hidePopoverTimeout);
		this.hidePopoverTimeout = null;
	}

	private hidePopover() {
		if (!this.popoverEl) return;
		this.popoverEl.style.display = 'none';
		this.activeTokenRange = null;
		this.activeTokenType = null;
		this.activeTokenValue = null;
		this.activeTokenProp = null;
	}

	private positionPopover() {
		if (!this.popoverEl || !this.editorEl || !this.activeTokenRange) return;
		const tokenEl = this.editorEl.querySelector(
			`.reveal-token[data-token-start="${this.activeTokenRange.start}"][data-token-end="${this.activeTokenRange.end}"]`
		) as HTMLElement | null;
		if (!tokenEl) return;
		const rect = tokenEl.getBoundingClientRect();
		const maxLeft = window.innerWidth - this.popoverEl.offsetWidth - 8;
		const left = Math.max(8, Math.min(rect.left, maxLeft));
		const maxTop = window.innerHeight - this.popoverEl.offsetHeight - 8;
		const top = Math.max(8, Math.min(rect.bottom + 2, maxTop));
		this.popoverEl.style.left = `${left}px`;
		this.popoverEl.style.top = `${top}px`;
	}

	private parseColor(value: string): { r: number; g: number; b: number; a: number } | null {
		const temp = document.createElement('div');
		temp.style.color = value;
		document.body.appendChild(temp);
		const computed = getComputedStyle(temp).color;
		temp.remove();
		const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
		if (!match) return null;
		return {
			r: Number(match[1]),
			g: Number(match[2]),
			b: Number(match[3]),
			a: match[4] ? Number(match[4]) : 1
		};
	}

	private rgbToHex(r: number, g: number, b: number): string {
		return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
	}

	private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
		const value = hex.replace('#', '');
		if (value.length !== 6) return null;
		const r = parseInt(value.slice(0, 2), 16);
		const g = parseInt(value.slice(2, 4), 16);
		const b = parseInt(value.slice(4, 6), 16);
		if ([r, g, b].some((n) => Number.isNaN(n))) return null;
		return { r, g, b };
	}

	private formatColorOutput(r: number, g: number, b: number, a: number, original: string): string {
		const hex = this.rgbToHex(r, g, b);
		const hasAlpha = a < 1;
		if (original.trim().startsWith('rgb')) {
			return hasAlpha ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
		}
		if (/^#/.test(original) && /[0-9a-f]{8}/i.test(original)) {
			const alpha = Math.round(a * 255)
				.toString(16)
				.padStart(2, '0');
			return `${hex}${alpha}`;
		}
		return hasAlpha ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : hex;
	}

	private splitTopLevelArgs(input: string): string[] {
		const args: string[] = [];
		let current = '';
		let depth = 0;
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === '(') depth++;
			if (ch === ')') depth--;
			if (ch === ',' && depth === 0) {
				args.push(current.trim());
				current = '';
				continue;
			}
			current += ch;
		}
		if (current.trim().length > 0) args.push(current.trim());
		return args;
	}

	private parseGradient(value: string): { type: string; prefix: string | null; stops: { color: string; position: string | null }[] } | null {
		const match = value.match(/^(linear-gradient|radial-gradient|conic-gradient)\((.*)\)$/i);
		if (!match) return null;
		const type = match[1];
		const args = this.splitTopLevelArgs(match[2]);
		if (args.length === 0) return null;

		let prefix: string | null = null;
		if (args.length > 0 && this.isGradientPrefix(args[0])) {
			prefix = args.shift() || null;
		}

		const stops: { color: string; position: string | null }[] = [];
		const colorRegex = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b|\bcurrentcolor\b/gi;

		for (const arg of args) {
			const matchColor = colorRegex.exec(arg);
			colorRegex.lastIndex = 0;
			if (!matchColor) continue;
			const color = matchColor[0];
			const position = arg.slice(matchColor.index + color.length).trim();
			stops.push({ color, position: position.length > 0 ? position : null });
		}

		return { type, prefix, stops };
	}

	private isGradientPrefix(value: string): boolean {
		return /\b(to\b|deg|turn|rad|circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner|at)\b/i.test(value);
	}
}

export default class RevealObsidianPlugin extends Plugin {
	private isRevealed: boolean = false;
	private fileExplorerButton: HTMLElement | null = null;
	private styleEl: HTMLStyleElement | null = null;
	private virtualElements: HTMLElement[] = [];

	async onload() {
		console.log('Loading Reveal .obsidian plugin');

		this.registerView(CONFIG_VIEW_TYPE, (leaf) => new ConfigFileView(leaf));

		// Ajouter le style CSS
		this.injectStyles();

		// Ajouter le bouton dans l'explorateur de fichiers
		this.app.workspace.onLayoutReady(() => {
			this.insertButton();
		});

		// Ajouter une commande
		this.addCommand({
			id: 'toggle-obsidian-folder',
			name: tr(this.app, 'toggleObsidianFolderCommand'),
			callback: () => this.toggleReveal()
		});
	}

	onunload() {
		console.log('Unloading Reveal .obsidian plugin');
		this.removeVirtualFolder();
		this.app.workspace.detachLeavesOfType(CONFIG_VIEW_TYPE);
		if (this.styleEl) this.styleEl.remove();
		if (this.fileExplorerButton) this.fileExplorerButton.remove();
	}

	private injectStyles() {
		this.styleEl = document.createElement('style');
		this.styleEl.id = 'reveal-obsidian-styles';
		this.styleEl.textContent = `
			/* Style du bouton reveal */
			.reveal-obsidian-button {
				color: var(--text-muted);
			}
			.reveal-obsidian-button:hover {
				color: var(--text-normal);
			}
			.reveal-obsidian-button.is-active {
				color: var(--text-accent);
			}

			/* Style du dossier virtuel .obsidian */
			.virtual-obsidian-item {
				opacity: 0.85;
			}
			.virtual-obsidian-item .nav-folder-title,
			.virtual-obsidian-item .nav-file-title {
				color: var(--text-accent) !important;
			}
			.virtual-obsidian-item .nav-folder-title-content::before,
			.virtual-obsidian-item.is-root > .nav-folder-title .nav-folder-title-content::before {
				content: "";
			}
			.virtual-obsidian-item .nav-file-title:hover,
			.virtual-obsidian-item .nav-folder-title:hover {
				background-color: var(--background-modifier-hover);
			}

			/* View pour fichiers .obsidian */
			.reveal-config-view {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
			.reveal-config-header {
				padding: 8px 12px;
				border-bottom: 1px solid var(--background-modifier-border);
				font-size: var(--font-ui-small);
				color: var(--text-muted);
			}
			.reveal-config-path {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.reveal-config-editor-wrap {
				flex: 1;
			}
			.reveal-config-editor {
				flex: 1;
				width: 100%;
				height: 100%;
				padding: 12px;
				border: none;
				outline: none;
				background: var(--background-primary);
				color: var(--text-normal);
				font-family: var(--font-monospace);
				font-size: var(--font-text-size);
				white-space: pre-wrap;
				word-break: break-word;
				overflow: auto;
			}
			.reveal-config-editor:focus {
				box-shadow: inset 0 0 0 1px var(--background-modifier-border);
			}

			.reveal-live-action.is-active {
				color: var(--text-accent);
			}
			.is-disabled {
				opacity: 0.4;
				pointer-events: none;
			}

			.reveal-token {
				--reveal-token-accent: var(--text-accent);
				border-radius: 4px;
				padding: 0 3px;
				border: 1px solid color-mix(in srgb, var(--reveal-token-accent) 55%, transparent);
				background: color-mix(in srgb, var(--reveal-token-accent) 18%, transparent);
				box-shadow: 0 0 0 1px color-mix(in srgb, var(--reveal-token-accent) 25%, transparent);
				cursor: pointer;
			}
			.reveal-token-color {
				--reveal-token-accent: var(--reveal-token-color);
				background: color-mix(in srgb, var(--reveal-token-color) 22%, transparent);
			}
			.reveal-token-color::after {
				content: '';
				display: inline-block;
				width: 0.7em;
				height: 0.7em;
				margin-left: 0.3em;
				border-radius: 2px;
				background: var(--reveal-token-color);
				border: 1px solid rgba(0, 0, 0, 0.25);
				vertical-align: middle;
			}
			.reveal-token-gradient {
				--reveal-token-accent: #ff8ad0;
			}
			.reveal-token-gradient::after {
				content: '';
				display: inline-block;
				width: 1.2em;
				height: 0.7em;
				margin-left: 0.3em;
				border-radius: 2px;
				background-image: var(--reveal-token-gradient);
				border: 1px solid rgba(0, 0, 0, 0.25);
				vertical-align: middle;
			}
			.reveal-token-number {
				--reveal-token-accent: #6bb5ff;
			}
			.reveal-token-enum {
				--reveal-token-accent: #f5c04a;
				text-decoration: none;
			}
			.reveal-token-transform {
				--reveal-token-accent: #7ddc83;
			}
			.reveal-token-shadow {
				--reveal-token-accent: #f08a5d;
			}
			.reveal-toggle {
				width: 14px;
				height: 14px;
				accent-color: var(--text-accent);
			}
			.reveal-button,
			.reveal-shadow-chip,
			.reveal-shadow-remove {
				background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				color: var(--text-normal);
				padding: 2px 6px;
				border-radius: 4px;
				font-size: 11px;
				cursor: pointer;
			}
			.reveal-shadow-chip.is-active {
				background: var(--background-modifier-hover);
				border-color: var(--text-accent);
			}
			.reveal-shadow-list {
				display: flex;
				flex-direction: column;
				gap: 6px;
				margin: 6px 0 8px;
			}
			.reveal-shadow-item {
				display: grid;
				grid-template-columns: auto 1fr auto;
				gap: 6px;
				align-items: center;
			}
			.reveal-shadow-summary {
				font-size: 11px;
				color: var(--text-muted);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.reveal-token-popover {
				position: fixed;
				z-index: 10000;
				min-width: 260px;
				max-width: 360px;
				background: var(--background-secondary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 8px;
				padding: 8px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
				display: none;
				pointer-events: auto;
			}
			.reveal-token-popover::before {
				content: '';
				position: absolute;
				top: -6px;
				left: 0;
				right: 0;
				height: 6px;
			}
			.reveal-popover-title {
				font-size: 12px;
				font-weight: 600;
				color: var(--text-normal);
				margin-bottom: 6px;
			}
			.reveal-popover-row {
				display: flex;
				gap: 6px;
				align-items: center;
				margin-bottom: 6px;
			}
			.reveal-popover-row:last-child {
				margin-bottom: 0;
			}
			.reveal-popover-label {
				font-size: 11px;
				color: var(--text-muted);
				min-width: 60px;
			}
			.reveal-color-input {
				width: 34px;
				height: 28px;
				padding: 0;
				border: none;
				background: transparent;
			}
			.reveal-text-input,
			.reveal-number-input,
			.reveal-select {
				flex: 1;
				background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				color: var(--text-normal);
				padding: 4px 6px;
				border-radius: 4px;
				font-family: var(--font-monospace);
				font-size: 12px;
			}
			.reveal-range {
				flex: 1;
			}
			.reveal-gradient-preview {
				height: 24px;
				border-radius: 4px;
				border: 1px solid var(--background-modifier-border);
				margin-bottom: 8px;
			}
		`;
		document.head.appendChild(this.styleEl);
	}

	private async toggleReveal() {
		this.isRevealed = !this.isRevealed;
		this.updateFileExplorerButton();

		if (this.isRevealed) {
			await this.createVirtualFolder();
		} else {
			this.removeVirtualFolder();
		}
	}

	private insertButton() {
		const navButtonsContainer = document.querySelector('.nav-buttons-container');
		if (!navButtonsContainer) {
			setTimeout(() => this.insertButton(), 500);
			return;
		}
		if (navButtonsContainer.querySelector('.reveal-obsidian-button')) return;

		this.fileExplorerButton = document.createElement('div');
		this.fileExplorerButton.className = 'nav-action-button reveal-obsidian-button clickable-icon';
		this.fileExplorerButton.setAttribute('aria-label', tr(this.app, 'showObsidian'));
		setIcon(this.fileExplorerButton, 'eye-off');

		this.fileExplorerButton.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.toggleReveal();
		});

		navButtonsContainer.appendChild(this.fileExplorerButton);
	}

	private updateFileExplorerButton() {
		if (!this.fileExplorerButton) return;
		if (this.isRevealed) {
			setIcon(this.fileExplorerButton, 'eye');
			this.fileExplorerButton.setAttribute('aria-label', tr(this.app, 'hideObsidian'));
			this.fileExplorerButton.addClass('is-active');
		} else {
			setIcon(this.fileExplorerButton, 'eye-off');
			this.fileExplorerButton.setAttribute('aria-label', tr(this.app, 'showObsidian'));
			this.fileExplorerButton.removeClass('is-active');
		}
	}

	private getFileExplorer(): FileExplorerView | undefined {
		const leaves = this.app.workspace.getLeavesOfType('file-explorer');
		if (leaves.length > 0) {
			return leaves[0].view as unknown as FileExplorerView;
		}
		return undefined;
	}

	private getFileExplorerContainer(fileExplorer: FileExplorerView): HTMLElement | null {
		const navContainer = fileExplorer?.dom?.navFileContainerEl;
		if (navContainer instanceof HTMLElement) return navContainer;

		const rootChildren = fileExplorer?.dom?.infinityScroll?.rootEl?.childrenEl;
		if (rootChildren instanceof HTMLElement) return rootChildren;

		const containerEl = (fileExplorer as any).containerEl as HTMLElement | undefined;
		if (!containerEl) return null;

		return containerEl.querySelector('.nav-files-container');
	}

	private async createVirtualFolder() {
		this.removeVirtualFolder();

		const fileExplorer = this.getFileExplorer();
		if (!fileExplorer) {
			console.error('File explorer not found');
			return;
		}

		// AccÃ©der au conteneur des fichiers
		const containerEl = this.getFileExplorerContainer(fileExplorer);
		if (!containerEl) {
			console.error('File explorer container not found');
			return;
		}

		console.log('FileExplorer found, creating virtual folder...');

		// Lire le contenu du dossier .obsidian
		const configDir = this.getConfigDir();
		const obsidianContent = await this.readObsidianFolder(configDir);
		console.log('Obsidian content:', obsidianContent);

		// CrÃ©er l'Ã©lÃ©ment DOM du dossier principal .obsidian
		const obsidianFolderEl = this.createFolderDOM(configDir, obsidianContent, true);
		
		// InsÃ©rer en premier dans le conteneur
		containerEl.insertBefore(obsidianFolderEl, containerEl.firstChild);
		this.virtualElements.push(obsidianFolderEl);

		fileExplorer.dom?.infinityScroll?.compute?.();
	}

	private getConfigDir(): string {
		const configDir = this.app.vault.configDir;
		return configDir && configDir.length > 0 ? configDir : '.obsidian';
	}

	private async readObsidianFolder(folderPath: string): Promise<{folders: string[], files: string[]}> {
		try {
			const adapter = this.app.vault.adapter;
			const result = await adapter.list(folderPath);
			return result;
		} catch (e) {
			console.error('Error reading .obsidian folder:', e);
			return { folders: [], files: [] };
		}
	}

	private async readSubFolder(folderPath: string): Promise<{folders: string[], files: string[]}> {
		try {
			const adapter = this.app.vault.adapter;
			const result = await adapter.list(folderPath);
			return result;
		} catch (e) {
			console.error('Error reading folder:', folderPath, e);
			return { folders: [], files: [] };
		}
	}

	private createFolderDOM(folderPath: string, content: {folders: string[], files: string[]}, isRoot: boolean = false): HTMLElement {
		const folderName = folderPath.split('/').pop() || folderPath;

		// Conteneur du dossier
		const folderEl = document.createElement('div');
		folderEl.className = 'tree-item nav-folder virtual-obsidian-item';
		if (isRoot) folderEl.addClass('is-root');
		folderEl.addClass('is-collapsed');

		// Titre du dossier
		const titleEl = document.createElement('div');
		titleEl.className = 'tree-item-self is-clickable mod-collapsible nav-folder-title';
		titleEl.setAttribute('data-path', folderPath);
		titleEl.draggable = true;

		// IcÃ´ne de collapse
		const collapseIcon = document.createElement('div');
		collapseIcon.className = 'tree-item-icon collapse-icon nav-folder-collapse-indicator is-collapsed';
		setIcon(collapseIcon, 'right-triangle');
		titleEl.appendChild(collapseIcon);

		// IcÃ´ne de dossier
		const folderIconEl = document.createElement('div');
		folderIconEl.className = 'tree-item-icon';
		setIcon(folderIconEl, 'folder');
		titleEl.appendChild(folderIconEl);

		// Nom du dossier
		const titleContent = document.createElement('div');
		titleContent.className = 'tree-item-inner nav-folder-title-content';
		titleContent.textContent = folderName;
		titleEl.appendChild(titleContent);

		folderEl.appendChild(titleEl);

		// Conteneur des enfants
		const childrenEl = document.createElement('div');
		childrenEl.className = 'tree-item-children nav-folder-children';
		childrenEl.style.display = 'none';

		// Trier: dossiers d'abord, puis fichiers
		const sortedFolders = [...content.folders].sort((a, b) =>
			a.split('/').pop()!.localeCompare(b.split('/').pop()!)
		);
		const sortedFiles = [...content.files].sort((a, b) =>
			a.split('/').pop()!.localeCompare(b.split('/').pop()!)
		);

		// Ajouter les sous-dossiers
		for (const subFolder of sortedFolders) {
			const subFolderEl = this.createFolderDOM(subFolder, { folders: [], files: [] }, false);
			subFolderEl.setAttribute('data-needs-load', 'true');
			childrenEl.appendChild(subFolderEl);
		}

		// Ajouter les fichiers
		for (const file of sortedFiles) {
			const fileEl = this.createFileDOM(file);
			childrenEl.appendChild(fileEl);
		}

		folderEl.appendChild(childrenEl);

		// Toggle au clic
		titleEl.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			
			const isCollapsed = folderEl.hasClass('is-collapsed');
			
			if (isCollapsed) {
				// Ouvrir le dossier
				folderEl.removeClass('is-collapsed');
				collapseIcon.removeClass('is-collapsed');
				childrenEl.style.display = 'block';

				// Charger le contenu des sous-dossiers si nÃ©cessaire
				const needsLoad = childrenEl.querySelectorAll('[data-needs-load="true"]');
				for (const el of Array.from(needsLoad)) {
					const path = el.querySelector('.nav-folder-title')?.getAttribute('data-path');
					if (path) {
						const subContent = await this.readSubFolder(path);
						const subChildrenEl = el.querySelector('.nav-folder-children');
						if (subChildrenEl && (subContent.folders.length > 0 || subContent.files.length > 0)) {
							// Ajouter les sous-dossiers
							for (const subFolder of subContent.folders.sort()) {
								const subFolderEl = this.createFolderDOM(subFolder, { folders: [], files: [] }, false);
								subFolderEl.setAttribute('data-needs-load', 'true');
								subChildrenEl.appendChild(subFolderEl);
							}
							// Ajouter les fichiers
							for (const file of subContent.files.sort()) {
								const fileEl = this.createFileDOM(file);
								subChildrenEl.appendChild(fileEl);
							}
						}
						el.removeAttribute('data-needs-load');
					}
				}
			} else {
				// Fermer le dossier
				folderEl.addClass('is-collapsed');
				collapseIcon.addClass('is-collapsed');
				childrenEl.style.display = 'none';
			}
		});

		// Menu contextuel
		titleEl.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.showFolderContextMenu(e, folderPath);
		});

		return folderEl;
	}

	private createFileDOM(filePath: string): HTMLElement {
		const fileName = filePath.split('/').pop() || filePath;

		const fileEl = document.createElement('div');
		fileEl.className = 'tree-item nav-file virtual-obsidian-item';

		const titleEl = document.createElement('div');
		titleEl.className = 'tree-item-self is-clickable nav-file-title';
		titleEl.setAttribute('data-path', filePath);
		titleEl.draggable = true;

		// IcÃ´ne du fichier
		const iconEl = document.createElement('div');
		iconEl.className = 'tree-item-icon';
		const ext = fileName.split('.').pop()?.toLowerCase() || '';
		let iconName = 'file';
		if (ext === 'json') iconName = 'file-json';
		else if (ext === 'js') iconName = 'file-code';
		else if (ext === 'css') iconName = 'palette';
		else if (ext === 'md') iconName = 'file-text';
		else if (ext === 'ts') iconName = 'file-code';
		setIcon(iconEl, iconName);
		titleEl.appendChild(iconEl);

		// Nom du fichier
		const titleContent = document.createElement('div');
		titleContent.className = 'tree-item-inner nav-file-title-content';
		titleContent.textContent = fileName;
		titleEl.appendChild(titleContent);

		fileEl.appendChild(titleEl);

		// Ouvrir le fichier au clic
		titleEl.addEventListener('click', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this.openFile(filePath);
		});

		// Menu contextuel
		titleEl.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.showFileContextMenu(e, filePath);
		});

		return fileEl;
	}

	private async openFileInObsidian(filePath: string): Promise<boolean> {
		const exists = await this.app.vault.adapter.exists(filePath);
		if (!exists) {
			new Notice(tr(this.app, 'fileNotFound'));
			return false;
		}

		const leaf = this.app.workspace.getLeaf(false);
		await leaf.setViewState({
			type: CONFIG_VIEW_TYPE,
			state: { filePath },
			active: true
		});
		return true;
	}

	private async openFile(filePath: string) {
		await this.openFileInObsidian(filePath);
	}

	private async revealInExplorer(filePath: string) {
		try {
			const basePath = (this.app.vault.adapter as any).basePath;
			const absolutePath = basePath + '/' + filePath.replace(/\//g, '\\');
			const { shell } = require('electron');
			shell.showItemInFolder(absolutePath);
		} catch (err) {
			console.error('Error revealing file:', err);
		}
	}

	private showFileContextMenu(event: MouseEvent, filePath: string) {
		const menu = new Menu();
		
		menu.addItem((item) => {
			item.setTitle(tr(this.app, 'openInObsidian'))
				.setIcon('file-text')
				.onClick(() => this.openFileInObsidian(filePath));
		});

		menu.addItem((item) => {
			item.setTitle(tr(this.app, 'revealInExplorer'))
				.setIcon('folder')
				.onClick(() => this.revealInExplorer(filePath));
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle(tr(this.app, 'copyPath'))
				.setIcon('copy')
				.onClick(() => {
					const basePath = (this.app.vault.adapter as any).basePath;
					navigator.clipboard.writeText(basePath + '\\' + filePath.replace(/\//g, '\\'));
				});
		});

		menu.showAtMouseEvent(event);
	}

	private showFolderContextMenu(event: MouseEvent, folderPath: string) {
		const menu = new Menu();

		menu.addItem((item) => {
			item.setTitle(tr(this.app, 'revealInExplorer'))
				.setIcon('folder')
				.onClick(() => this.revealInExplorer(folderPath));
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle(tr(this.app, 'copyPath'))
				.setIcon('copy')
				.onClick(() => {
					const basePath = (this.app.vault.adapter as any).basePath;
					navigator.clipboard.writeText(basePath + '\\' + folderPath.replace(/\//g, '\\'));
				});
		});

		menu.showAtMouseEvent(event);
	}

	private removeVirtualFolder() {
		// Supprimer tous les Ã©lÃ©ments virtuels
		for (const el of this.virtualElements) {
			el.remove();
		}
		this.virtualElements = [];

		// Supprimer aussi par classe
		document.querySelectorAll('.virtual-obsidian-item.is-root').forEach(el => el.remove());
	}
}

